import { AptosNightly, WalletAdapter } from './types'
import { RawTransaction } from 'aptos/dist/transaction_builder/aptos_types'

export class NightlyWalletAdapter implements WalletAdapter {
  _publicKey: string
  _connected: boolean
  constructor() {
    this._connected = false
    this._publicKey = '0x' + '0'.repeat(64)
  }

  get connected() {
    return this._connected
  }

  public async signAllTransactions(transactions: RawTransaction[]): Promise<Uint8Array[]> {
    return await this._provider.signAllTransactions(transactions)
  }

  private get _provider(): AptosNightly {
    if ((window as any)?.nightly.aptos) {
      return (window as any).nightly.aptos
    } else {
      throw new Error('AptosNightly: aptos is not defined')
    }
  }

  get publicKey() {
    return this._publicKey
  }

  async signTransaction(transaction: RawTransaction) {
    return await this._provider.signTransaction(transaction)
  }

  async connect(onDisconnect?: () => void, eager?: boolean) {
    try {
      const pk = await this._provider.connect(onDisconnect, eager)
      this._publicKey = pk
      this._connected = true
      return pk
    } catch (error) {
      console.log(error)
      throw new Error('User refused connection')
    }
  }

  async disconnect() {
    if (this._publicKey) {
      await this._provider.disconnect()
      this._publicKey = '0x' + '0'.repeat(64)
      this._connected = false
    }
  }
}
