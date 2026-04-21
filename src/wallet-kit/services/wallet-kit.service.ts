import {
  StellarWalletsKit,
  FreighterModule,
  FREIGHTER_ID,
  xBullModule,
  AlbedoModule,
  HanaModule,
  RabetModule,
  HotWalletModule,
  WalletNetwork,
} from "@creit.tech/stellar-wallets-kit";
import { WatchWalletChanges } from "@stellar/freighter-api";

import { Networks } from "@stellar/stellar-sdk";

import EventService from "./event.service";

type NetworkState = {
  network: string;
  networkPassphrase: string;
};

type SetUserKey = (value: string) => void;
type SetNetwork = (value: NetworkState) => void;

export const WalletKitEvents = {
  login: "login",
  logout: "logout",
  accountChanged: "accountChanged",
} as const;

export const walletModules = [
  new FreighterModule(),
  new HotWalletModule(),
  new xBullModule(),
  new AlbedoModule(),
  new HanaModule(),
  new RabetModule(),
];

export default class WalletKitServiceClass {
  walletKit: StellarWalletsKit;
  event = new EventService();
  watcher: InstanceType<typeof WatchWalletChanges> | null = null;

  constructor() {
    this.walletKit = new StellarWalletsKit({
      network: WalletNetwork.PUBLIC,
      modules: walletModules,
      selectedWalletId: FREIGHTER_ID,
    });
  }

  async startFreighterWatching(
    publicKey: string,
    setUserKey: SetUserKey,
    setNetwork: SetNetwork
  ): Promise<void> {
    if (!this.watcher) {
      this.watcher = new WatchWalletChanges(1000);
    }

    this.watcher.watch(async ({ address }: { address?: string }) => {
      if (publicKey === address || !address) return;

      const network = (await this.walletKit.getNetwork()) as NetworkState;

      setNetwork(network);
      setUserKey(address);

      this.event.trigger({
        type: WalletKitEvents.accountChanged,
        publicKey: address,
      });
    });
  }

  stopFreighterWatching(): void {
    this.watcher?.stop();
    this.watcher = null;
  }

  async login(
    id: string,
    setUserKey: SetUserKey,
    setNetwork: SetNetwork
  ): Promise<void> {
    this.walletKit.setWallet(id);

    const { address } = await this.walletKit.getAddress();

    let network: NetworkState;

    if (id === FREIGHTER_ID) {
      network = (await this.walletKit.getNetwork()) as NetworkState;
    } else {
      network = {
        network: "PUBLIC",
        networkPassphrase: Networks.PUBLIC,
      };
    }

    setNetwork(network);
    setUserKey(address);

    if (id === FREIGHTER_ID) {
      await this.startFreighterWatching(address, setUserKey, setNetwork);
    }

    this.event.trigger({
      type: WalletKitEvents.login,
      publicKey: address,
      id,
    });
  }

  async signTx(xdrRaw: string, network: NetworkState): Promise<string> {
    const { signedTxXdr } = await this.walletKit.signTransaction(xdrRaw, {
      networkPassphrase: network.networkPassphrase,
    });

    return signedTxXdr;
  }
}
