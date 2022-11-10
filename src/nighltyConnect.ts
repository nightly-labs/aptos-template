import { AptosNightly, AptosPublicKey, WalletAdapter } from './types'
import { TransactionPayload } from 'aptos/src/generated'
import {
  AptosAppInfo,
  NightlyConnectModal,
  clearPersistedSessionId,
  clearPersistedSessionPublicKey,
  getPersistedSessionId,
  getPersistedSessionPublicKey,
  setPersistedSessionPublicKey,
  AppAptos,
  NETWORK
} from '@nightlylabs/connect-aptos'

export class NCAptosWalletAdapter implements WalletAdapter {
  _publicKey: AptosPublicKey
  _connected: boolean
  private _connecting: boolean
  modal: NightlyConnectModal
  private _appInfo: Omit<AptosAppInfo, 'onUserConnect'>
  private _app: AppAptos | undefined
  private _onAppConnectSuccess = string => {}

  constructor(appInfo: Omit<AptosAppInfo, 'onUserConnect'>) {
    this._connected = false
    this._publicKey = AptosPublicKey.default()
    this._connecting = false
    this._publicKey = null
    this.modal = new NightlyConnectModal()
    this._appInfo = appInfo
  }

  get connected(): boolean {
    return this._connected
  }

  get connecting(): boolean {
    return this._connecting
  }

  get publicKey() {
    return this._publicKey
  }

  public async signAllTransactions(transactions: TransactionPayload[]): Promise<Uint8Array[]> {
    return await this._provider.signAllTransactions(transactions)
  }

  private get _provider(): AppAptos {
    if ((window as any)?.nightly.aptos) {
      return (window as any).nightly.aptos
    } else {
      throw new Error('AptosNightly: aptos is not defined')
    }
  }

  async connect() {
    return new Promise<string>((resolve, reject) => {
      try {
        if (this.connected || this.connecting) {
          resolve(getPersistedSessionPublicKey())
          return
        }

        this._onAppConnectSuccess = resolve

        this._connecting = true
        clearPersistedSessionId()
        clearPersistedSessionPublicKey()
        if (!this._app) {
          let persistedId = getPersistedSessionId()
          const persistedPubkey = getPersistedSessionPublicKey()

          if (
            this._appInfo.appMetadata.persistent !== false &&
            persistedId !== null &&
            persistedPubkey === null
          ) {
            clearPersistedSessionId()
            persistedId = null
          }

          AppAptos.build({
            ...this._appInfo,
            onUserConnect: data => {
              this._publicKey = new AptosPublicKey(data.publicKey.toString())
              setPersistedSessionPublicKey(data.publicKey.toString())
              this._connecting = false
              this._connected = true
              console.log('connect', this._publicKey)
              this.modal.closeModal()
              this._onAppConnectSuccess(getPersistedSessionPublicKey())
              return this._publicKey.address()
            }
          })
            .then(app => {
              this._app = app

              if (
                this._appInfo.appMetadata.persistent !== false &&
                persistedId === app.sessionId &&
                persistedPubkey !== null
              ) {
                this._publicKey = new AptosPublicKey(persistedPubkey)
                this._connecting = false
                this._connected = true
                console.log('connect', this._publicKey)
                resolve(getPersistedSessionPublicKey())
                return this._publicKey
              } else {
                this.modal.openModal(app.sessionId, NETWORK.APTOS)
              }
            })
            .catch(error => {
              this._connecting = false

              console.log('error', error)
              reject(error)
            })
        } else {
          this.modal.openModal(this._app.sessionId, NETWORK.APTOS)
        }

        this.modal.onClose = () => {
          if (this._connecting) {
            this._connecting = false
          }
        }
      } catch (error: any) {
        this._connecting = false

        console.log('error', error)
        reject(error)
      }
    })
  }

  async signTransaction(transaction: TransactionPayload) {
    return await this._app.signTransaction(transaction)
  }

  async signMessage(msg: string) {
    if (!this._provider) {
      return msg
    }

    return await this._provider.signMessage(msg)
  }

  async disconnect() {
    if (this._publicKey) {
      this._app = undefined
      this._publicKey = null
      this._connected = false
      clearPersistedSessionId()
      clearPersistedSessionPublicKey()
    }
  }
}
