import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { FaucetClient } from 'aptos'
import { UserTransactionRequest } from 'aptos/dist/api/data-contracts'
import { useState } from 'react'
import './App.css'
import { NightlyWalletAdapter } from './nightly'

const NightlyAptos = new NightlyWalletAdapter()
const TESTNET_URL = 'https://fullnode.devnet.aptoslabs.com'
const FAUCET_URL = 'https://faucet.devnet.aptoslabs.com'
const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
function App() {
  const [userPublicKey, setUserPublicKey] = useState<string | undefined>(undefined)
  return (
    <div className='App'>
      <header className='App-header'>
        <Typography>{userPublicKey ? `Hello, ${userPublicKey}` : 'Hello, stranger'}</Typography>
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
            await Promise.all([faucetClient.fundAccount(value, 10_000)])
          }}
        >
          Connect Aptos
        </Button>{' '}
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) return
            const userAccountData = await (
              await fetch(`${TESTNET_URL}/accounts/${userPublicKey}`)
            ).json()
            const seqNum = parseInt(userAccountData['sequence_number'])

            const payload = {
              type: 'script_function_payload',
              function: '0x1::Coin::transfer',
              type_arguments: ['0x1::TestCoin::TestCoin'],
              arguments: [`${userPublicKey}`, '100'.toString()],
            }
            const plaintx: UserTransactionRequest = {
              gas_currency_code: 'SEX', // RANDOM ?
              sender: userPublicKey,
              sequence_number: seqNum.toString(),
              max_gas_amount: '2000',
              gas_unit_price: '1',
              // Unix timestamp, in seconds + 10 minutes
              expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(),
              payload: payload,
            }

            const signedTx = await NightlyAptos.signTransaction(plaintx)
            const result = await faucetClient.submitTransaction(signedTx)
            console.log(result)
          }}
        >
          Send test 100 TestCoin
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (!userPublicKey) return
            const userAccountData = await (
              await fetch(`${TESTNET_URL}/accounts/${userPublicKey}`)
            ).json()
            const seqNum = parseInt(userAccountData['sequence_number'])

            const payload = {
              type: 'script_function_payload',
              function: '0x1::Coin::transfer',
              type_arguments: ['0x1::TestCoin::TestCoin'],
              arguments: [`${userPublicKey}`, '100'.toString()],
            }
            const plaintx: UserTransactionRequest = {
              gas_currency_code: 'SEX', // RANDOM ?
              sender: userPublicKey,
              sequence_number: seqNum.toString(),
              max_gas_amount: '2000',
              gas_unit_price: '1',
              // Unix timestamp, in seconds + 10 minutes
              expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(),
              payload: payload,
            }
            const plaintx2: UserTransactionRequest = {
              gas_currency_code: 'SEX', // RANDOM ?
              sender: userPublicKey,
              sequence_number: seqNum.toString(),
              max_gas_amount: '2000',
              gas_unit_price: '1',
              // Unix timestamp, in seconds + 10 minutes
              expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(),
              payload: payload,
            }

            const signedTxs = await NightlyAptos.signAllTransactions([plaintx, plaintx2])
            for (const tx of signedTxs) {
              const result = await faucetClient.submitTransaction(tx)
              console.log(result)
            }
          }}
        >
          Send test 2x 100 TestCoin
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            await NightlyAptos.disconnect()
          }}
        >
          Disconnect Aptos
        </Button>
      </header>
    </div>
  )
}

export default App
