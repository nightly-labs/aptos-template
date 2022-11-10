import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { FaucetClient } from 'aptos'
import { useEffect, useState } from 'react'
import './App.css'
import { CreateCollectionButton } from './CreateCollection'
import { NightlyWalletAdapter } from './nightly'
import { AptosPublicKey } from './types'
import { TransactionPayload } from 'aptos/src/generated'
import docs from './docs.png'
import { NCAptosWalletAdapter } from './nighltyConnect'
const NightlyAptos = new NightlyWalletAdapter()
const TESTNET_URL = 'https://fullnode.testnet.aptoslabs.com'
const FAUCET_URL = 'https://fullnode.testnet.aptoslabs.com'
const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
const ADDRESS_TO_SEND_COIN = '0x507e4b853aa11f93fcd53a668240a5ea131a85003ed7144e20da367b6528fc87'

const NightlyConnectAptos = new NCAptosWalletAdapter({
  appMetadata: {
    additionalInfo: ' Test Additional infoo',
    application: 'Test application',
    description: 'Test description',
    icon: 'https://docs.nightly.app/img/logo.png'
  }
})

function App() {
  const [userPublicKey, setUserPublicKey] = useState<AptosPublicKey | undefined>(undefined)
  useEffect(() => {
    NightlyConnectAptos.modal.onOpen = () => {
      console.log('modal opened with event handler')
    }
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <div>
          <Button
            variant='contained'
            onClick={() => {
              window.open('https://docs.nightly.app/docs/aptos/aptos/detecting')
            }}
            style={{ background: '#2680d9', marginBottom: '64px' }}>
            <img src={docs} style={{ width: '40px', height: '40px', paddingRight: '16px' }} />
            Open documentation
          </Button>
        </div>

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
          }}>
          Connect Aptos
        </Button>
        <Button
          variant='contained'
          color='primary'
          style={{ margin: 10 }}
          onClick={async () => {
            try {
              const a = await NightlyConnectAptos.connect()
              setUserPublicKey(new AptosPublicKey(a))
            } catch (err) {
              console.log('error', err)
            }
          }}>
          Nightly Connect
        </Button>
        <Button
          variant='contained'
          style={{ margin: 10 }}
          onClick={async () => {
            if (userPublicKey) {
              try {
                const tx: TransactionPayload = {
                  type: 'entry_function_payload',
                  arguments: [
                    '0x4834430bce35346ccadf1901ef0576d7d4247c4f31b08b8b7ae67884a323ab68',
                    1000
                  ],
                  function: '0x1::coin::transfer',
                  type_arguments: ['0x1::aptos_coin::AptosCoin']
                }

                if (NightlyConnectAptos._connected) {
                  const bcsTxn = await NightlyConnectAptos.signTransaction(tx)
                  const result = await faucetClient.submitSignedBCSTransaction(bcsTxn)
                  console.log('transaction hash -> ', result)
                } else {
                  const bcsTxn = await NightlyAptos.signTransaction(tx)
                  const result = await faucetClient.submitSignedBCSTransaction(bcsTxn)
                  console.log('transaction hash -> ', result)
                }
              } catch (err) {
                console.log(err)
              }
            }
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
        <CreateCollectionButton userPublicKey={userPublicKey} NightlyAptos={NightlyAptos} />

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
