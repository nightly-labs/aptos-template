import { Button, Grid } from '@mui/material'
import { AptosClient, FaucetClient, Types } from 'aptos'
import { AptosPublicKey } from './types'
import { NightlyWalletAdapter } from './nightly'

// import { TransactionPayload } from 'aptos/src/generated'

import { fenecImages } from './utils/const'
import { useState } from 'react'

const TESTNET_URL = 'https://fullnode.devnet.aptos.nightly.app/v1'
const FAUCET_URL = 'https://fullnode.testnet.aptoslabs.com'

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
export const CreateCollectionButton: React.FC<{
  userPublicKey: AptosPublicKey | undefined
  NightlyAptos: NightlyWalletAdapter
}> = ({ userPublicKey, NightlyAptos }) => {
  const aptosClient = new AptosClient(TESTNET_URL)
  const NUMBER_ITEMS = 5
  const [amountItems, setAmountItems] = useState(NUMBER_ITEMS)
  const createCollection = async () => {
    if (!userPublicKey) return
    const faucetClient = new FaucetClient(TESTNET_URL, FAUCET_URL)
    // give faucet
    // try {
    //   // for (let i = 0; i < 3; i++) {
    //   await faucetClient.fundAccount(userPublicKey.address(), 1_000_000_000)
    //   // }
    // } catch {
    //   console.log('Error give faucet')
    // }

    const collectionName = 'red-1 ' + (Math.floor(Math.random() * 1000) + 1).toString()
    try {
      const tx: Types.TransactionPayload = {
        type: 'entry_function_payload',
        arguments: [
          collectionName,
          'We invite you to test Nightly Wallet"',
          fenecImages[(Math.floor(Math.random() * fenecImages.length) + 1) % fenecImages.length],
          10000,
          [false, false, false]
        ],
        function: '0x3::token::create_collection_script',
        type_arguments: []
      }

      const signedTx = await NightlyAptos.signTransaction(tx)
      const arrayCreateTokens: Types.TransactionPayload[] = []

      const result = await aptosClient.submitSignedBCSTransaction(signedTx)
      console.log('Create collection : ', result)
      await sleep(300)

      for (let x = 0; x < amountItems; x++) {
        const tokenName = 'red_token #' + x.toString()
        const createTokenPayload: Types.TransactionPayload = {
          type: 'entry_function_payload',
          arguments: [
            collectionName,
            tokenName,
            'Nightly is an amazing wallet on Aptos/Near/Solana. Enjoy and visit https://nightly.app/ ',
            1,
            1,
            fenecImages[x % fenecImages.length],
            userPublicKey.address(),
            10,
            1,
            [true, true, true, true, true],
            ['Test', 'Data'],
            [
              'Nightly',
              `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`
            ],
            ['string', 'string']
          ],
          function: '0x3::token::create_token_script',
          type_arguments: []
        }
        arrayCreateTokens.push(createTokenPayload)
      }

      const signedTxsCreate = await NightlyAptos.signAllTransactions(arrayCreateTokens)
      const promiseCreate: Array<Promise<Types.PendingTransaction>> = []

      for (const signedCreateTx of signedTxsCreate) {
        await sleep(200)
        promiseCreate.push(aptosClient.submitSignedBCSTransaction(signedCreateTx))
      }
      // await sleep(3000)
      // const arrayMutableTokens: Types.TransactionPayload[] = []
      // for (let x = 0; x < amountItems; x++) {
      //   const tokenName = 'Fennec ' + x.toString()
      //   const mutableTokenPayload: Types.TransactionPayload = {
      //     type: 'entry_function_payload',
      //     function: '0x3::token::mutate_token_properties',
      //     type_arguments: [],
      //     arguments: [
      //       userPublicKey.address(),
      //       userPublicKey.address(),
      //       collectionName,
      //       tokenName,
      //       0,
      //       1,
      //       ['Test', 'Data'],
      //       ['Nightly mutable', '2022-12-12'],
      //       ['string', 'string']
      //     ]
      //   }
      //   arrayMutableTokens.push(mutableTokenPayload)
      // }

      // const signedTxsMutable = await NightlyAptos.signAllTransactions(arrayMutableTokens)
      // const promise: Array<Promise<Types.PendingTransaction>> = []
      // for (const signedMutableTx of signedTxsMutable) {
      //   await sleep(500)
      //   promise.push(aptosClient.submitSignedBCSTransaction(signedMutableTx))
      // }

      // const mutableResults = await Promise.all(promise)
      // console.log('Modified', mutableResults)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid item>
      <Button
        variant='contained'
        style={{ margin: 10 }}
        onClick={async () => {
          await createCollection()
        }}>
        Create Collection with {amountItems} items
      </Button>
      <input
        value={amountItems}
        max={25}
        min={1}
        style={{ width: '40px', margin: '0px 16px', height: '36px', fontSize: '16px' }}
        type='number'
        onChange={e => {
          setAmountItems(+e.currentTarget.value)
        }}
      />
    </Grid>
  )
}
