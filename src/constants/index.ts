import { ChainId, JSBI, Percent, Token, WRAPPED } from '@dctdao/sdk'
import { AbstractConnector } from '@sushi-web3-react/abstract-connector'

import {  injected } from '../connectors'

export const BRIDGE_ADDRESS:{ [chainId in ChainId]: string } = 
{
  [ChainId.MAINNET]: '0x79c9717F61cef22e0F8286Fe5C2106F3D7C963a8', 
  [ChainId.MOONBEAM_TEST]: '' ,
  [ChainId.BINANCE_TEST]: '',
  [ChainId.ROPSTEN]: '0xf9b357d604F6F082b2dEaC40169369AA7670c557',
  [ChainId.OPERA_TEST]: '',
  [ChainId.AVAX_TEST]: '0xc602B07E084c73740962621BB35573c5717D6538',
  [ChainId.AVAX]: '0xe1Df271492b9c6d7EB5BF381594B884eD70C7a84'
}

export const HANDLER_GENERIC_ADDRESS: { [chainId in ChainId]: string } = 
{ 
  [ChainId.MAINNET]: '0xFBA564939397e71c75c9CbB29E6E23b89e4272BE', 
  [ChainId.MOONBEAM_TEST]: '' ,
  [ChainId.BINANCE_TEST]: '',
  [ChainId.ROPSTEN]: '0xB0C061fbf22D8409cafe398BFB284d100887A0fc',
  [ChainId.OPERA_TEST]: '',
  [ChainId.AVAX_TEST]: '0x25457330796995FDC235ee2eaB7358571a3ec95f',
  [ChainId.AVAX]: '0xdb664603Fa01bab6baf68c13BF2aE24A5eFaB9fB'
}

export const BRIDGE_CHAINIDS:{ [chainId in ChainId]: number } = 
{
  [ChainId.MAINNET]: 0, 
  [ChainId.MOONBEAM_TEST]: -1 ,
  [ChainId.BINANCE_TEST]: -1,
  [ChainId.ROPSTEN]: 0,
  [ChainId.OPERA_TEST]: -1,
  [ChainId.AVAX_TEST]: 1,
  [ChainId.AVAX]: 1
}

export const RESOURCE_ID:{[chainId in ChainId]?:Record<string, string> } = 
{ /*!!!!!!!!!!!!!!! CHECK FOR CHECKSUMADDRESSES otherwise it not works!!!!!*/
  [ChainId.AVAX_TEST]: {
    '0x8B3862921F237173E1A02f1aF986324552655d43':'0xd4c9b1901408dd3ac66e649afcc3848364da672f8b7bc14bd7a3fbc674ad1f39', //DCTD
    '0xBCCC6b23548552a81287883619CFB736d55c1765':'0x0f8a193ff464434486c0daf7db2a895884365d2bc84ba47a68fcf89c1b14b5b8' //WETH
  },
  [ChainId.ROPSTEN]: {
    '0xDD38baf080c501babC74b12Bc4eb2661Eaf661a1':'0xd4c9b1901408dd3ac66e649afcc3848364da672f8b7bc14bd7a3fbc674ad1f39', //DCTD
    '0xb603cEa165119701B58D56d10D2060fBFB3efad8':'0x0f8a193ff464434486c0daf7db2a895884365d2bc84ba47a68fcf89c1b14b5b8' //WETH
  },
  [ChainId.MAINNET]: {
    '0xb566E883555aEBf5B1DB211070b530Ab00a4B18a':'0xd4c9b1901408dd3ac66e649afcc3848364da672f8b7bc14bd7a3fbc674ad1f39', //DCTD
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2':'0x0f8a193ff464434486c0daf7db2a895884365d2bc84ba47a68fcf89c1b14b5b8' //WETH
  },
  [ChainId.AVAX]: {
    '0x8Db2dBdFB50480FE79F6576deAA4f6E68DcBfb15':'0xd4c9b1901408dd3ac66e649afcc3848364da672f8b7bc14bd7a3fbc674ad1f39', //DCTD
    '0x9b71805C8D82E0DA861cA3C2b6c11A331Bd6A318':'0x0f8a193ff464434486c0daf7db2a895884365d2bc84ba47a68fcf89c1b14b5b8' //WETH
  },
}

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = 
{ 
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441', 
  [ChainId.MOONBEAM_TEST]: '0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec' ,
  [ChainId.BINANCE_TEST]: '0x91658d67482022A0dd3F0472770f26E14e65B131',
  [ChainId.ROPSTEN]: '0x56E9b83050f94a0E7F0C911cA23FDa9522feB2Db',
  [ChainId.OPERA_TEST]: '0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec',
  [ChainId.AVAX_TEST]: '0x0E668D7aDa037bfC8aA58a8b3670CA341dC2DBA3',
  [ChainId.AVAX]: '0x0b222D84Abae1541C04c212C3436Ee161Fb8FFC1'
}






// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 18, 'WBTC', 'Wrapped BTC')
export const SUSHI = new Token(ChainId.MAINNET, '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', 18, 'SUSHI', 'SushiToken')
export const YAM = new Token(ChainId.MAINNET, '0x0e2298E3B3390e3b945a5456fBf59eCc3f55DA16', 18, 'YAM', 'YAM')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')
export const YFI = new Token(ChainId.MAINNET, '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', 18, 'YFI', 'Yearn')
export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const CRV = new Token(
  ChainId.MAINNET,
  '0xD533a949740bb3306d119CC777fa900bA034cd52',
  18,
  'CRV',
  'Curve Dao Token'
)
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')


const WRAPPED_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WRAPPED[ChainId.MAINNET]],
  [ChainId.MOONBEAM_TEST]: [WRAPPED[ChainId.MOONBEAM_TEST]],
  [ChainId.BINANCE_TEST]: [WRAPPED[ChainId.BINANCE_TEST]],
  [ChainId.ROPSTEN]: [WRAPPED[ChainId.ROPSTEN]],
  [ChainId.OPERA_TEST]: [WRAPPED[ChainId.OPERA_TEST]],
  [ChainId.AVAX_TEST]: [WRAPPED[ChainId.AVAX_TEST]],
  [ChainId.AVAX]: [WRAPPED[ChainId.AVAX]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.MAINNET]: [
    ...WRAPPED_ONLY[ChainId.MAINNET],
    DAI,
    USDC,
    USDT,
    SUSHI,
    YAM,
    WBTC,
    RUNE,
    CREAM,
    BAC,
    FXS,
    CRV,
    ALPHA
  ]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WRAPPED[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_ONLY[ChainId.MAINNET], DAI, USDC, USDT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_ONLY[ChainId.MAINNET], DAI, USDC, USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
 /* INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },*/
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }/*,
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  LATTICE: {
    connector: lattice,
    name: 'Lattice',
    iconName: 'gridPlusWallet.png',
    description: 'Connect to GridPlus Wallet.',
    href: null,
    color: '#40a9ff',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }*/
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
