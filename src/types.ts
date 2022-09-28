import { RawTransaction } from 'aptos/dist/transaction_builder/aptos_types'
import * as SHA3 from 'js-sha3'
import base58 from 'bs58'
import { TransactionPayload } from 'aptos/dist/generated'

export interface WalletAdapter {
  publicKey: AptosPublicKey
  connected: boolean
  signTransaction: (transaction: TransactionPayload) => Promise<Uint8Array>
  signAllTransactions: (transaction: TransactionPayload[]) => Promise<Uint8Array[]>
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
  publicKey: AptosPublicKey
  _onDisconnect: () => void
  private readonly _nightlyEventsMap
  constructor(eventMap: Map<string, (data: any) => any>)
  connect(onDisconnect?: () => void, eagerConnect?: boolean): Promise<AptosPublicKey>
  disconnect(): Promise<void>
  signTransaction(tx: TransactionPayload): Promise<Uint8Array>
  signAllTransactions(txs: TransactionPayload[]): Promise<Uint8Array[]>
}

export class AptosPublicKey {
  private readonly hexString: string

  static fromBase58(base58string: string) {
    const bytes = Buffer.from(base58.decode(base58string))
    const hexString = bytes.toString('hex')
    return new AptosPublicKey(hexString)
  }

  static default() {
    return new AptosPublicKey('0'.repeat(64))
  }

  address() {
    const hash = SHA3.sha3_256.create()
    hash.update(Buffer.from(this.asPureHex(), 'hex'))
    hash.update('\x00')
    return '0x' + hash.hex()
  }

  asUint8Array() {
    return new Uint8Array(Buffer.from(this.asPureHex(), 'hex'))
  }

  asString() {
    return this.hexString
  }

  asPureHex() {
    return this.hexString.substr(2)
  }

  constructor(hexString: string) {
    if (hexString.startsWith('0x')) {
      this.hexString = hexString
    } else {
      this.hexString = `0x${hexString}`
    }
  }
}
