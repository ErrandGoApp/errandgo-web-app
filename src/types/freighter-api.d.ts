declare module "@stellar/freighter-api" {
  export class WatchWalletChanges {
    constructor(interval?: number);
    watch(callback: (data: { address?: string }) => void): void;
    stop(): void;
  }
}
