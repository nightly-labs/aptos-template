import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  useQuery
} from '@apollo/client'

const GET_COIN_HASH_QUERY = gql`
  query GetCoinHash($owner_address: String) {
    current_coin_balances(where: { owner_address: { _eq: $owner_address } }) {
      coin_type_hash
      amount
    }
  }
`
const GET_COIN_INFOS_QUERY = gql`
  query GetCoinInfos($coin_type_hash: String) {
    coin_infos(where: { coin_type_hash: { _eq: $coin_type_hash } }) {
      symbol
      name
      decimals
      creator_address
      coin_type_hash
      coin_type
    }
  }
`

export const getUserCoins = async (userAddress: string) => {
  const graphqlClient = getGraphqlClient('testnet')

  const coinHashResponse = await graphqlClient.query({
    query: GET_COIN_HASH_QUERY,
    variables: {
      owner_address: userAddress
    }
  })

  const tokenData = []
  for (const coinHash of coinHashResponse.data.current_coin_balances) {
    const response = await graphqlClient.query({
      query: GET_COIN_INFOS_QUERY,
      variables: {
        coin_type_hash: coinHash.coin_type_hash
      }
    })
    tokenData.push({ ...response.data.coin_infos[0], amount: coinHash.amount })
  }

  return tokenData
}

export const networks = {
  testnet: 'https://testnet.aptoslabs.com',
  premainnet: 'https://premainnet.aptosdev.com/'
}

export type NetworkName = keyof typeof networks

export const getGraphqlURI = (networkName: NetworkName): string | undefined => {
  switch (networkName) {
    case 'testnet':
      return 'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql'
    default:
      return undefined
  }
}

export const getGraphqlClient = (networkName: NetworkName): ApolloClient<NormalizedCacheObject> => {
  return new ApolloClient({
    link: new HttpLink({
      uri: getGraphqlURI(networkName)
    }),
    cache: new InMemoryCache()
  })
}
