import Web3 from 'web3'

const abi_weth = [
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
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
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
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
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
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
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
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' }
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
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Withdrawal',
    type: 'event'
  }
]
const abi_wbnb = [
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
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' }
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
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
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
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
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
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' }
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
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'guy', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Deposit',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' }
    ],
    name: 'Withdrawal',
    type: 'event'
  }
]
const address_weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const address_wbnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
//获得ethereum的provider的web3实例
function getETHInstanceUseWallet(): Web3 {
  if (window.ethereum) {
    return new Web3(window.ethereum)
  } else {
    return new Web3('https://eth.drpc.org')
  }
}
//获得ethereum的provider的web3实例
function getETHInstance(): Web3 {
  return new Web3('https://eth.drpc.org')
}

function getBSCInstance(): Web3 {
  return new Web3(new Web3.providers.HttpProvider('https://bsc-pokt.nodies.app'))
}

//授权代币
async function approveContract(
  abi: any,
  contractAddress: string,
  bussiness: string,
  amount: number,
  accountAddr: string
) {
  try {
    const web3 = getETHInstanceUseWallet()

    // const contract = new web3.eth.Contract(abi_weth,"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
    // const gas = await contract.methods.approve("0x4e47d5afcb46da598793f0dd0773553c03420c3d",1).estimateGas()
    const contract = new web3.eth.Contract(abi, contractAddress)
    const gas = await contract.methods.approve(bussiness, amount).estimateGas()
    const balance = await web3.eth.getBalance(contractAddress)
    // 余额小于等于授权数量和燃料费之和
    /**
     * amount number类型 gas：bigint 类型 运算符“+”不能应用于类型“number”和“bigint”
     * bigint是一个表示任意大整数的类型，而number是一个64位的浮点数类型。由于bigint的值可能非常大，
     *  超过了number的表示范围，因此不能直接与number类型的值相加。
     */
    if (balance <= BigInt(amount) + gas) {
      alert('余额不足！')
      return
    }
    await contract.methods.approve(bussiness, amount).send({ from: accountAddr })
  } catch (e) {
    console.log(e)
  }
}
//创建交易对象
async function createTransObj(fromAddr: string, toAddr: string, amount: number) {
  const web3 = getETHInstanceUseWallet()
  const transObj = {
    from: fromAddr,
    to: toAddr,
    value: web3.utils.toWei(amount, 'ether'),
    gas: await web3.eth.getGasPrice()
  }
  const gas = await web3.eth.estimateGas(transObj)
  transObj.gas = gas
  return transObj
}
//获得一般(wbnb)合约实例
export function getCommContract(tokenAddress: string, ChainCode: string | undefined) {
  if (ChainCode === 'ETH') {
    const web3 = getETHInstance()
    return new web3.eth.Contract(abi_weth, tokenAddress)
  } else if (ChainCode === 'BSC') {
    const web3 = getBSCInstance()
    return new web3.eth.Contract(abi_wbnb, tokenAddress)
  } else {
    const web3 = getETHInstance()
    return new web3.eth.Contract(abi_weth, tokenAddress)
  }
}

//获得根据pairaddress获得某个币的余额
export async function getBalanceOfPair(
  pairAddress: string,
  tokenAddress: string,
  ChainCode: string | undefined
): Promise<number> {
  const contract = getCommContract(tokenAddress, ChainCode)
  validateContract(contract)
  return await contract.methods.balanceOf(pairAddress).call()
}

async function validateContract(contract: any) {
  try {
    await contract.methods.totalSupply().call()
    return true
  } catch (error) {
    console.error('Invalid contract:', error)
    return false
  }
}

export { getETHInstanceUseWallet as getETHInstance, approveContract, createTransObj }
