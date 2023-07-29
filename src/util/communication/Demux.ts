type CommandHandler = (payload: any) => void;
type SubscriptionHandler = (payload: any, emit: (payload: object) => void) => () => void;
type DemuxHandlers = {
  commands: Record<string, CommandHandler>;
  subscriptions: Record<string, SubscriptionHandler>;
}

type MuxCommand = {
  type: string;
  payload: object;
}
type MuxSubscribe = {
  type: 'subscribe';
  event: string;
  payload: object;
  subscriptionId: string;
}
type MuxUnsubscribe = {
  type: 'unsubscribe';
  subscriptionId: string;
}

/**
 * Demux is a wrapper around chrome.runtime.Port that provides a simple command-and-subscribe interface.
 */
export default class Demux {
  private subscriptions = new Map<string, () => void>();

  constructor(private config: DemuxHandlers) {}

  listen(): () => void {
    const listener = (port: chrome.runtime.Port) => {
      port.onMessage.addListener((message: { type: string }) => {
        if (message.type === 'subscribe') return this.onSubscribe(port, message as MuxSubscribe);
        if (message.type === 'unsubscribe') return this.onUnsubscribe(message as MuxUnsubscribe);
        this.onCommand(message as MuxCommand);
      });
    };

    chrome.runtime.onConnect.addListener(listener);
    return () => chrome.runtime.onConnect.removeListener(listener);
  }

  private onSubscribe(port: chrome.runtime.Port, message: MuxSubscribe) {
    const unregister = this.config.subscriptions[message.event]?.(
      message.payload,
      (payload: object) => port.postMessage({ subscriptionId: message.subscriptionId, payload }),
    );

    this.subscriptions.set(message.subscriptionId, unregister);
  }

  private onUnsubscribe(message: MuxUnsubscribe) {
    this.subscriptions.get(message.subscriptionId)?.();
    this.subscriptions.delete(message.subscriptionId);
  }

  private onCommand(message: MuxCommand) {
    this.config.commands[message.type]?.(message.payload);
  }
}
