import { Button, Grid } from '@mui/material'
import {
  AptosClient,
  HexString,
  TokenClient,
  TransactionBuilder,
  TransactionBuilderABI
} from 'aptos'
import { Uint64 } from 'aptos/dist/transaction_builder/bcs/types'
import { AptosPublicKey } from './types'
import {
  AccountAddress,
  ChainId,
  EntryFunction,
  RawTransaction,
  StructTag,
  TransactionPayloadEntryFunction,
  TypeTagStruct
} from 'aptos/dist/transaction_builder/aptos_types'
import { NightlyWalletAdapter } from './nightly'

export const TOKEN_ABIS = [
  // aptos-token/build/AptosToken/abis/token/create_collection_script.abi
  '01186372656174655F636F6C6C656374696F6E5F736372697074000000000000000000000000000000000000000000000000000000000000000305746F6B656E3020637265617465206120656D70747920746F6B656E20636F6C6C656374696F6E207769746820706172616D65746572730005046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000B6465736372697074696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000375726907000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700076D6178696D756D020E6D75746174655F73657474696E670600',
  // aptos-token/build/AptosToken/abis/token/create_token_script.abi
  '01136372656174655F746F6B656E5F736372697074000000000000000000000000000000000000000000000000000000000000000305746F6B656E1D2063726561746520746F6B656E20776974682072617720696E70757473000D0A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000B6465736372697074696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000762616C616E636502076D6178696D756D020375726907000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E670015726F79616C74795F70617965655F61646472657373041A726F79616C74795F706F696E74735F64656E6F6D696E61746F720218726F79616C74795F706F696E74735F6E756D657261746F72020E6D75746174655F73657474696E6706000D70726F70657274795F6B6579730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000F70726F70657274795F76616C7565730606010E70726F70657274795F74797065730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700',
  // aptos-token/build/AptosToken/abis/token/direct_transfer_script.abi
  '01166469726563745f7472616e736665725f736372697074000000000000000000000000000000000000000000000000000000000000000305746f6b656e0000051063726561746f72735f61646472657373040a636f6c6c656374696f6e07000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e6700046e616d6507000000000000000000000000000000000000000000000000000000000000000106737472696e6706537472696e67001070726f70657274795f76657273696f6e0206616d6f756e7402',
  // aptos-token/build/AptosToken/abis/token_transfers/offer_script.ab
  '010C6F666665725F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E7366657273000006087265636569766572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E0206616D6F756E7402',
  // aptos-token/build/AptosToken/abis/token_transfers/claim_script.abi
  '010C636C61696D5F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E73666572730000050673656E646572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E02',
  // aptos-token/build/AptosToken/abis/token_transfers/cancel_offer_script.abi
  '011363616E63656C5F6F666665725F73637269707400000000000000000000000000000000000000000000000000000000000000030F746F6B656E5F7472616E7366657273000005087265636569766572040763726561746F72040A636F6C6C656374696F6E07000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700046E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67001070726F70657274795F76657273696F6E02',
  // modified.abi
  '01176D75746174655F746F6B656E5F70726F70657274696573000000000000000000000000000000000000000000000000000000000000000305746F6B656EFD01206D75746174652074686520746F6B656E2070726F706572747920616E64207361766520746865206E65772070726F706572747920696E20546F6B656E53746F72650A2069662074686520746F6B656E2070726F70657274795F76657273696F6E20697320302C2077652077696C6C206372656174652061206E65772070726F70657274795F76657273696F6E2070657220746F6B656E20616E642073746F7265207468652070726F706572746965730A2069662074686520746F6B656E2070726F70657274795F76657273696F6E206973206E6F7420302C2077652077696C6C206A75737420757064617465207468652070726F70657274794D617000090B746F6B656E5F6F776E6572040763726561746F72040F636F6C6C656374696F6E5F6E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000A746F6B656E5F6E616D6507000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E670016746F6B656E5F70726F70657274795F76657273696F6E0206616D6F756E7402046B6579730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E67000676616C7565730606010574797065730607000000000000000000000000000000000000000000000000000000000000000106737472696E6706537472696E6700'
]

export const MAX_U64_BIG_INT: Uint64 = BigInt(2 ** 64) - 1n

export const CreateCollectionButton: React.FC<{
  userPublicKey: AptosPublicKey | undefined
  NightlyAptos: NightlyWalletAdapter
}> = ({ userPublicKey, NightlyAptos }) => {
  const TESTNET_URL = 'https://fullnode.devnet.aptoslabs.com'
  const aptosClient = new AptosClient(TESTNET_URL)
  const tokenClient = new TokenClient(aptosClient)
  const transactionBuilderABI = new TransactionBuilderABI(
    TOKEN_ABIS.map(abi => new HexString(abi).toUint8Array())
  )

  const createCollection = async () => {
    if (!userPublicKey) return
    const collectionName =
      'Test Nightly Collection' + (Math.floor(Math.random() * 100) + 1).toString()
    try {
      tokenClient.createCollection
      const createColelctionPayload = transactionBuilderABI.buildTransactionPayload(
        '0x3::token::create_collection_script',
        [],
        [
          collectionName,
          'We invite you to test Nightly Wallet"',
          'https://pbs.twimg.com/media/FKWweLoXIAcoVNV.jpg',
          MAX_U64_BIG_INT,
          [false, false, false]
        ]
      )
      const [{ sequence_number: sequnceNumber }, chainId] = await Promise.all([
        aptosClient.getAccount(userPublicKey.address()),
        aptosClient.getChainId()
      ])
      const rawTxn = new RawTransaction(
        AccountAddress.fromHex(userPublicKey.address()),
        BigInt(sequnceNumber),
        createColelctionPayload,
        BigInt(2000),
        BigInt(0),
        BigInt(Math.floor(Date.now() / 1000)),
        new ChainId(chainId)
      )

      const signedTx = await NightlyAptos.signTransaction(rawTxn)
      const result = await aptosClient.submitSignedBCSTransaction(signedTx)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid item>
      <Button
        variant='contained'
        style={{ margin: 10 }}
        onClick={() => {
          createCollection()
        }}>
        Create Collection with 3 items
      </Button>
    </Grid>
  )
}
