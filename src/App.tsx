import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { FaucetClient } from 'aptos'

import { useState } from 'react'
import './App.css'
import { NightlyWalletAdapter } from './nightly'
import { AptosPublicKey } from './types'
import { TransactionPayload } from 'aptos/src/generated'
const NightlyAptos = new NightlyWalletAdapter()
const TESTNET_URL = 'https://rpc.aptos.nightly.app'
const FAUCET_URL = 'https://faucet.devnet.aptoslabs.com'
const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
function App() {
  const [userPublicKey, setUserPublicKey] = useState<AptosPublicKey | undefined>(undefined)
  return (
    <div className='App'>
      <header className='App-header'>
        <Typography>
          {userPublicKey ? `Hello, ${userPublicKey.address()}` : 'Hello, stranger'}
        </Typography>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            const value = await NightlyAptos.connect(() => {
              console.log('Trigger disconnect Aptos')
              setUserPublicKey(undefined)
            })

            setUserPublicKey(value)
            console.log(value.toString())
            await Promise.all([faucetClient.fundAccount(value.address(), 10_000)])
          }}>
          Connect Aptos
        </Button>

        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) return
            const tx: TransactionPayload = {
              type: 'entry_function_payload',
              arguments: [
                '0x4834430bce35346ccadf1901ef0576d7d4247c4f31b08b8b7ae67884a323ab68',
                1000
              ],
              function: '0x1::coin::transfer',
              type_arguments: ['0x1::aptos_coin::AptosCoin']
            }

            const bcsTxn = await NightlyAptos.signTransaction(tx)
            const result = await faucetClient.submitSignedBCSTransaction(bcsTxn)
            console.log('transaction hash -> ', result)
          }}>
          Send test 1000 AptosCoin
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) return
            const tx: TransactionPayload = {
              type: 'entry_function_payload',
              arguments: [
                '0x4834430bce35346ccadf1901ef0576d7d4247c4f31b08b8b7ae67884a323ab68',
                1000
              ],
              function: '0x1::coin::transfer',
              type_arguments: ['0x1::aptos_coin::AptosCoin']
            }
            const tx2: TransactionPayload = {
              type: 'entry_function_payload',
              arguments: [
                '0x4834430bce35346ccadf1901ef0576d7d4247c4f31b08b8b7ae67884a323ab68',
                1000
              ],
              function: '0x1::coin::transfer',
              type_arguments: ['0x1::aptos_coin::AptosCoin']
            }
            const bcsTxn = await NightlyAptos.signAllTransactions([tx, tx2])
            for (const tx of bcsTxn) {
              const result = await faucetClient.submitTransaction(tx)
              console.log('transaction hash -> ', result)
            }
          }}>
          Send test 1000 AptosCoin x2
        </Button>
        {/* <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) return
            const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
              faucetClient.getAccount(userPublicKey.address()),
              faucetClient.getChainId()
            ])
            const token = new TypeTagStruct(StructTag.fromString('0x1::aptos_coin::AptosCoin'))
            const scriptFunctionPayload = new TransactionPayloadEntryFunction(
              EntryFunction.natural(
                '0x1::coin',
                'transfer',
                [token],
                [
                  bcsToBytes(
                    AccountAddress.fromHex(
                      '0x34aa3f5a088f6cf8531c43138aaef7ef6ed6eb9ad23faeab1f161207d8020d21'
                    )
                  ),
                  bcsSerializeUint64(1_000)
                ]
              )
            )
            const plaintx = new RawTransaction(
              AccountAddress.fromHex(userPublicKey.address()),
              BigInt(sequnceNumber),
              scriptFunctionPayload,
              BigInt(1000),
              BigInt(1),
              BigInt(Math.floor(Date.now() / 1000) + 10),
              new ChainId(chainId)
            )
            const plaintx2 = new RawTransaction(
              AccountAddress.fromHex(userPublicKey.address()),
              BigInt((parseFloat(sequnceNumber) + 1).toString()),
              scriptFunctionPayload,
              BigInt(1000),
              BigInt(1),
              BigInt(Math.floor(Date.now() / 1000) + 10),
              new ChainId(chainId)
            )
            const signedTxs = await NightlyAptos.signAllTransactions([plaintx, plaintx2])
            for (const tx of signedTxs) {
              const result = await faucetClient.submitSignedBCSTransaction(tx)
              console.log(result)
            }
          }}>
          Send test 2x 1000 AptosCoin
        </Button> */}

        {/* <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlyAptos.disconnect()
          }}>
          Disconnect Aptos
        </Button> */}
      </header>
    </div>
  )
}

export default App
