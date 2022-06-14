import { RawTransaction } from "aptos/dist/transaction_builder/aptos_types";

export interface WalletAdapter {
  publicKey: string;
  connected: boolean;
  signTransaction: (transaction: RawTransaction) => Promise<Uint8Array>;
  signAllTransactions: (transaction: RawTransaction[]) => Promise<Uint8Array[]>;
  connect: () => any;
  disconnect: () => any;
}

export declare class Nightly {
  aptos: AptosNightly;
  private readonly _nightlyEventsMap;
  constructor();
  invalidate(): void;
}

export declare class AptosNightly {
  publicKey: string;
  _onDisconnect: () => void;
  private readonly _nightlyEventsMap;
  constructor(eventMap: Map<string, (data: any) => any>);
  connect(onDisconnect?: () => void, eagerConnect?: boolean): Promise<string>;
  disconnect(): Promise<void>;
  signTransaction(tx: RawTransaction): Promise<Uint8Array>;
  signAllTransactions(txs: RawTransaction[]): Promise<Uint8Array[]>;
}
