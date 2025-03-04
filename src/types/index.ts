import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { mainnet, bsc, arbitrum, xLayer, base, optimism } from '@reown/appkit/networks'

export enum MarketTrend {
  Bullish = 1,
  Bearish = 2
}

export type User = {
  name: string
  age: number
}

export enum RankingType {
  SIMPLE = 1,
  COMPLETE = 2
}

export const LOGO_URL = 'https://img.apihellodex.lol/'

export const CHAIN_URL: any = {
  BSC: 'https://bscscan.com/tx/',
  ETH: 'https://etherscan.io/tx/',
  ARB: 'https://arbiscan.io/tx/',
  BASE: 'https://basescan.org/tx/',
  SOLANA: 'https://solscan.io/tx/'
}

/**
 * 区块链的 chain_id
 * “1”表示以太坊；
 * “10”表示 Optimism；
 * “25”表示 Cronos；
 * “56”表示 BSC；
 * “100”表示 Gnosis；
 * “128”表示 HECO；
 * “137”表示 Polygon；
 * “250”表示 Fantom；
 * “321”表示 KCC；
 * “324”表示 zkSync Era；
 * “10001”表示 ETHW；
 * “201022”表示 FON；
 * “42161”表示 Arbitrum；
 * “43114”表示 Avalanche；
 * “59144”表示 Linea Mainnet；
 * “8453”表示 Base；
 * “tron”表示 Tron；
 * “534352”表示 Scroll；
 * “204”表示 opBNB；
 * “5000”表示 Mantle；
 * “42766”表示 ZKFair；
 * “81457”表示 Blast；
 * “169”表示 Manta Pacific；
 * “80085”表示 Berachain Artio 测试网；
 * “4200”表示 Merlin；
 * “200901”表示 Bitlayer 主网；
 * “810180”表示 zkLink Nova；
 * “196”表示 X Layer 主网；
 */
export const CHAIN_ID: any = {
  BSC: '56',
  ETH: '1',
  ARB: '42161',
  BASE: '8453',
  SOLANA: '501',
  XLAYER: '196',
  OP: '10'
}

export const CHAIN_SYMBOL: any = {
  BSC: 'BNB',
  ETH: 'ETH',
  ARB: 'ETH',
  BASE: 'ETH',
  SOLANA: 'SOL',
  XLAYER: 'OKB',
  OP: 'ETH'
}

export const CHAIN_NETWORKS: any = {
  1: mainnet,
  56: bsc,
  42161: arbitrum,
  8453: base,
  196: xLayer,
  10: optimism,
  501: solana
}

export const USDT_CONFIG: any = {
  ETH: {
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: '6'
  },
  BSC: {
    symbol: 'USDT',
    address: '0x55d398326f99059ff775485246999027b3197955',
    decimals: '18'
  },
  ARB: {
    symbol: 'USDT',
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    decimals: '6'
  },
  OP: {
    symbol: 'USDT',
    address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    decimals: '6'
  },
  BASE: {
    symbol: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    decimals: '6'
  },
  CORE: {
    symbol: 'USDT',
    address: '0x900101d06a7426441ae63e9ab3b9b0f63be145f1',
    decimals: '6'
  },
  XLAYER: {
    symbol: 'USDT',
    address: '0x1e4a5963abfd975d8c9021ce480b42188849d41d',
    decimals: '18'
  },
  SOLANA: {
    symbol: 'USDT',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: '6'
  }
}

export const erc20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

export const infinityAmount =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export const TRANSFER_TYPE: any = {
  C: '一键清仓',
  M: '市价单',
  F: '一键交易',
  L: '限价单',
  S: '止盈止损',
  H: '一键回本'
}

export const LIMIT_ORDER_TYPE: any = {
  1: '限价单-高于价格后买入',
  2: '限价单抄底',
  3: '限价单止盈',
  4: '限价单止损',
  5: '限价单-高于价格后买入',
  6: '限价单-抄底',
  7: '限价单-止盈',
  8: '限价单-止损'
}

export const STATUS_TYPE: any = {
  440: '余额不足,失败',
  190: '手动取消',
  439: 'Gas费不足，失败',
  200: '确认成功',
  204: '确认失败'
}

export const MAIN_COIN: any = {
  WETH: 'ETH',
  BTCB: 'BTC'
}

export const QUICK_TRADE_CONFIG = {
  buyAmount: [0.1, 0.3, 1, 3, 10],
  sellAmount: [20, 40, 60, 80, 100],
  x: 380,
  y: 250,
  switch: true
}
