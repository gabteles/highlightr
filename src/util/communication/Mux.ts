import { v4 as uuidv4 } from 'uuid';

/**
 * Mux is a wrapper around chrome.runtime.Port that provides a simple command-and-subscribe interface.
 */
export default class Mux {
  private port: chrome.runtime.Port | null;
  private subscriptions = new Map<string, (payload: object) => void>();

  constructor() {
    this.port = null;
  }

  connect(): () => void {
    if (this.port) this.port.disconnect();
    this.port = chrome.runtime.connect();
    this.port.onMessage.addListener((message) => this.onMessageReceived(message));
    return () => this.port?.disconnect();
  }

  command(command: string, payload?: object) {
    this.port?.postMessage({ type: command, payload });
  }

  subscribe(event: string, payload: unknown, callback: (payload: object) => void): () => void {
    const subscriptionId = uuidv4();
    this.port?.postMessage({ type: 'subscribe', event, payload, subscriptionId });
    this.subscriptions.set(subscriptionId, callback);
    return () => this.unsubscribe(subscriptionId);
  }

  // TODO: Right now I'm only using this for subscriptions, but correct abstraction would be to
  // let this be used for commands/responses as well.
  private onMessageReceived(message: { subscriptionId: string; payload: object }) {
    const subscriptionId = message.subscriptionId;
    const subscriptionCallback = this.subscriptions.get(subscriptionId);
    if (!subscriptionCallback) return this.unsubscribe(subscriptionId);
    subscriptionCallback(message.payload);
  }

  private unsubscribe(subscriptionId: string) {
    this.subscriptions.delete(subscriptionId);
    this.port?.postMessage({ type: 'unsubscribe', subscriptionId });
  }
}
