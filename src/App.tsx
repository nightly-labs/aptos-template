import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { FaucetClient } from 'aptos'
import {
  AccountAddress,
  ChainId,
  EntryFunction,
  RawTransaction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct
} from 'aptos/dist/transaction_builder/aptos_types'
import { bcsSerializeUint64, bcsToBytes } from 'aptos/dist/transaction_builder/bcs'
import { Buffer } from 'buffer'
import { useState } from 'react'
import './App.css'
import { NightlyWalletAdapter } from './nightly'
import { AptosPublicKey } from './types'

const NightlyAptos = new NightlyWalletAdapter()
const TESTNET_URL = 'https://fullnode.devnet.aptoslabs.com'
const FAUCET_URL = 'https://faucet.devnet.aptoslabs.com'
const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
const ADDRESS_TO_SEND_COIN = '0x507e4b853aa11f93fcd53a668240a5ea131a85003ed7144e20da367b6528fc87'
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
            if (!userPublicKey) {
              console.log('Error with connected')
              return
            }

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
                  bcsToBytes(AccountAddress.fromHex(ADDRESS_TO_SEND_COIN)),
                  bcsSerializeUint64(1_000)
                ]
              )
            )
            const rawTxn = new RawTransaction(
              AccountAddress.fromHex(userPublicKey.address()),
              BigInt(sequnceNumber),
              scriptFunctionPayload,
              BigInt(2000),
              BigInt(0),
              BigInt(Math.floor(Date.now() / 1000) + 100000),
              new ChainId(chainId)
            )
            const bcsTxn = await NightlyAptos.signTransaction(rawTxn)
            const result = await faucetClient.submitSignedBCSTransaction(bcsTxn)
            console.log('transaction hash -> ', result)
          }}>
          Send test 1000 AptosCoin
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) {
              console.log('Error with connected')
              return
            }
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
                  bcsToBytes(AccountAddress.fromHex(ADDRESS_TO_SEND_COIN)),
                  bcsSerializeUint64(1_000)
                ]
              )
            )
            const plaintx = new RawTransaction(
              AccountAddress.fromHex(userPublicKey.address()),
              BigInt(sequnceNumber),
              scriptFunctionPayload,
              BigInt(2000),
              BigInt(0),
              BigInt(Math.floor(Date.now() / 1000) + 10),
              new ChainId(chainId)
            )
            const plaintx2 = new RawTransaction(
              AccountAddress.fromHex(userPublicKey.address()),
              BigInt((parseFloat(sequnceNumber) + 1).toString()),
              scriptFunctionPayload,
              BigInt(2000),
              BigInt(0),
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
        </Button>
        <Button
          variant='contained'
          color='primary'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) {
              console.log('Error with connected')
              return
            }
            const messageToSign =
              'I like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtlesI like turtles I like turtlesI like turtlesI like turtles'
            const signedMessage = await NightlyAptos.signMessage(messageToSign)
            console.log(signedMessage)
          }}>
          Sign Message
        </Button>

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
