import * as SHA3 from 'js-sha3'
import base58 from 'bs58'
import { SubmitTransactionRequest, UserTransactionRequest } from 'aptos/dist/api/data-contracts'

export interface WalletAdapter {
  publicKey: string
  connected: boolean
  signTransaction: (transaction: UserTransactionRequest) => Promise<SubmitTransactionRequest>
  signAllTransactions: (
    transaction: UserTransactionRequest[]
  ) => Promise<SubmitTransactionRequest[]>
  connect: () => any
  disconnect: () => any
}

export declare class Nightly {
  aptos: AptosNightly
  private readonly _nightlyEventsMap
  constructor()
  invalidate(): void
}

export declare class AptosNightly {
  publicKey: string
  _onDisconnect: () => void
  private readonly _nightlyEventsMap
  constructor(eventMap: Map<string, (data: any) => any>)
  connect(onDisconnect?: () => void, eagerConnect?: boolean): Promise<string>
  disconnect(): Promise<void>
  signTransaction(tx: UserTransactionRequest): Promise<SubmitTransactionRequest>
  signAllTransactions(txs: UserTransactionRequest[]): Promise<SubmitTransactionRequest[]>
}
