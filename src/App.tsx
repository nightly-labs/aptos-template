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
import { getUserCoins } from './utils/utils'

const NightlyAptos = new NightlyWalletAdapter()
const TESTNET_URL = 'https://testnet.aptoslabs.com/v1/'
const FAUCET_URL = 'https://faucet.testnet.aptoslabs.com'
const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
const ADDRESS_TO_SEND_COIN = '0x507e4b853aa11f93fcd53a668240a5ea131a85003ed7144e20da367b6528fc87'

function App() {
  const [userPublicKey, setUserPublicKey] = useState<AptosPublicKey | undefined>(undefined)
  const [userTokens, setUserTokens] = useState([])
  // const { data } = useQuery(GET_COIN_HASH_QUERY, {
  //   variables: {
  //     owner_address: userPublicKey.address()
  //   }
  // })

  useEffect(() => {
    if (userPublicKey) {
      // getUserCoins(userPublicKey.address())
      getUserCoins(userPublicKey.address()).then(response => {
        console.log(response)
        setUserTokens(response)
      })
    }
  }, [userPublicKey])

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
            console.log(value.toString())
            await Promise.all([
              faucetClient.fundAccount(value.address(), 100000000),
              faucetClient.fundAccount(value.address(), 100000000)
            ])
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
              arguments: [ADDRESS_TO_SEND_COIN, 1000],
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
              arguments: [ADDRESS_TO_SEND_COIN, 1000],
              function: '0x1::coin::transfer',
              type_arguments: ['0x1::aptos_coin::AptosCoin']
            }
            const tx2: TransactionPayload = {
              type: 'entry_function_payload',
              arguments: [ADDRESS_TO_SEND_COIN, 1000],
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            width: '100%',
            paddingTop: '72px'
          }}>
          <div>
            <span>Yours Coins</span>
            {userTokens.map(token => {
              return (
                <div
                  style={{
                    backgroundColor: '#dbdbdb',
                    borderRadius: '12px',
                    color: 'black'
                  }}>
                  <p>Symbol: {token.symbol}</p>
                  <p>Name: {token.name}</p>
                  <p>Amount: {token.amount}</p>
                  <p>Decimal: {token.decimals}</p>
                  <p>Coin_type: {token.coin_type}</p>
                  <p>Coin_type_hash: {token.coin_type_hash}</p>
                  <p>Creator_address: {token.creator_address}</p>
                </div>
              )
            })}
          </div>
          <div>
            <span>Yours Tokens (NFT)</span>
          </div>
          <div>
            <span>Yours Transaction</span>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
