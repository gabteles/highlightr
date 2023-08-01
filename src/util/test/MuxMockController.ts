import { waitFor } from '@testing-library/react';
import Mux from '../communication/Mux';

class MuxMockController {
  private mux: typeof Mux;

  constructor(mux: typeof Mux) {
    this.mux = mux;
    this.mux.prototype.connect = jest.fn().mockReturnValue(() => { });
    this.mux.prototype.command = jest.fn();
    this.mux.prototype.subscribe = jest.fn().mockReturnValue(() => {});
  }

  emit(payload: object, subscriptionIndex?: number) {
    const callback = (this.mux.prototype.subscribe as jest.Mock).mock.calls[subscriptionIndex || 0][2];
    callback(payload);
  }

  async waitForConnection() {
    return waitFor(() => expect(this.mux.prototype.connect as jest.Mock).toHaveBeenCalled());
  }

  async waitForSubscription(event?: string) {
    if (event) {
      return waitFor(() => (
        expect(this.mux.prototype.subscribe as jest.Mock)
          .toHaveBeenCalledWith(event, expect.any(Object), expect.any(Function))
      ));
    }

    return waitFor(() => expect(this.mux.prototype.subscribe as jest.Mock).toHaveBeenCalled());
  }

  async waitForCommand(command: string, payload?: object) {
    return waitFor(() => (
      expect(this.mux.prototype.command as jest.Mock)
        .toHaveBeenCalledWith(command, payload)
    ));
  }
}

export default MuxMockController;
