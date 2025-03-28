import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { useGlobalStore } from '@/stores/global'
import { erc20ABI, CHAIN_NETWORKS } from '@/types'

import { useAppKitProvider, useAppKitNetwork } from '@reown/appkit/vue'
import { type Provider } from '@reown/appkit-adapter-solana/vue'

import { BrowserProvider, Contract, formatUnits } from 'ethers'

import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

import bs58 from 'bs58'
import { mainNetworkCurrency } from '@/utils'
import { customMessage } from './message'

const okCoin = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const sol = 'So11111111111111111111111111111111111111112'

const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms))

// 代币精度格式化
export const decimalsFormat = (amount: any = 0, decimals: any = 0) => {
  const num: any = 10 ** decimals
  return new BigNumber(amount || 0).div(num).toString(10)
}

// 交易货币 余额格式化
export const balanceFormat = (params: any) => {
  if (
    params.baseTokenDecimals == 0 ||
    params.baseTokenDecimals == undefined ||
    params.baseTokenDecimals == null
  ) {
    return params.balance || 0
  } else {
    const num: any = 10 ** params.baseTokenDecimals
    return new BigNumber(params.balance || 0).div(num).toString(10)
  }
}

export const getEvmBalance = async (contract: any) => {
  const globalStore = useGlobalStore()
  const address = globalStore.walletInfo.address

  const bal =
    contract == '' || contract == okCoin
      ? await handCoinBalance(address)
      : await handleTokenBalance(address, contract)
  return bal
}

export const handCoinBalance = async (wallet: any) => {
  const web3 = new Web3(window.ethereum)
  const balanceWei = await web3.eth.getBalance(wallet)
  return balanceWei || 0
}

export const handleTokenBalance = async (wallet: any, token: any) => {
  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(erc20ABI, token)
  const balance = await contract.methods.balanceOf(wallet).call()
  return balance || 0
}

export const handleEvmTx = async (tx: any) => {
  return new Promise((resolve, reject) => {
    const web3 = new Web3(window.ethereum)
    const retObj = { status: false, msg: '', tx: '' }
    web3.eth
      .sendTransaction(tx)
      .on('transactionHash', function (hash) {
        console.log('Transaction hash:', hash)
        retObj.tx = hash
      })
      .on('receipt', function (receipt) {
        console.log('Transaction was mined in block:', receipt)
        if (receipt.status.toString() == '1') {
          retObj.status = true
          resolve(retObj)
        } else {
          retObj.status = false
          resolve(retObj)
        }
      })
      .on('error', function (error) {
        console.error(`Transaction error: ${JSON.stringify(error)}`)
        retObj.msg = error.message
        reject(retObj)
      })
      .catch(function (error: any) {
        retObj.msg = error.message
        reject(retObj)
      })
  })
}

/**
 *
 * @param userAddress 钱包地址/用户地址
 * @param spenderAddress  approveAddress
 * @param tokenAddress 代币地址
 * @param rpc rpc 网络
 * @returns allowance
 */

export const handleEvmAllowance = async (
  userAddress: any,
  spenderAddress: any,
  tokenAddress: any,
  rpc: any
) => {
  const web3 = rpc ? new Web3(new Web3.providers.HttpProvider(rpc)) : new Web3(window.ethereum)
  const contract = new web3.eth.Contract(erc20ABI, tokenAddress)
  const allowance = await contract.methods.allowance(userAddress, spenderAddress).call()
  return allowance
}

/**
 *
 * @param userAddress
 * @param spenderAddress
 * @param tokenAddress
 * @returns
 */
export const handleSolanaAllowance = async (
  userAddress: any,
  spenderAddress: any,
  tokenAddress: any,
  rpc: any
) => {
  const connection = new Connection(rpc, 'confirmed')
  const userAddress_publicKey = new PublicKey(userAddress)
  const tokenAddress_publicKey = new PublicKey(tokenAddress)

  console.log(spenderAddress)
  // const spenderAddress_publicKey = new PublicKey(spenderAddress)
  const userTokenAccount: any = ''

  try {
    const accountInfo: any = await connection.getParsedAccountInfo(userTokenAccount)
    console.log(`accountInfo: ${JSON.stringify(accountInfo)}`)
    // 检查授权信息
    return accountInfo.value && accountInfo.value.data.parsed.info.state === 'initialized' ? 1 : 0
  } catch (error) {
    console.error('Failed to fetch token account:', error)
    return 0
  }
}

export const handleEvmApprove = async (spenderAddress: any, tokenAddress: any, amount: any) => {
  const { walletProvider }: any = useAppKitProvider('eip155')
  const provider = new BrowserProvider(walletProvider)
  const signer = await provider.getSigner()

  // 创建代币合约实例
  const tokenContract = new Contract(tokenAddress, erc20ABI, signer)

  try {
    // 请求用户授权
    const tx = await tokenContract.approve(spenderAddress, amount)
    console.log('Transaction sent:', tx)

    // 等待交易被矿工确认
    await tx.wait()
    await delay(5000) // 等待5秒钟
    console.log('Transaction confirmed:', tx.hash)

    return true
  } catch (error) {
    if (JSON.stringify(error).indexOf('JSON-RPC error') !== -1) {
      customMessage({
        type: 'error',
        title: '钱包设置的公链RPC错误'
      })
    }
    console.error('Error approving tokens:', error)
    return false
  }
}

/**
 * @description evm 交易
 * @param res
 * @returns
 */
export const sendEvmTransaction = async (res: any) => {
  const { walletProvider }: any = useAppKitProvider('eip155')
  const provider = new BrowserProvider(walletProvider)
  const signer = await provider.getSigner()
  console.log(res)
  const tx = {
    to: res.to,
    value: res.value,
    gasLimit: res.gasLimit, //'500000',
    gasPrice: res.gasPrice,
    data: res.data
  }
  try {
    const txResponse = await signer.sendTransaction(tx)
    console.log('交易发送中...', txResponse)
    await txResponse.wait()
    console.log('交易成功:', txResponse)
    return true
  } catch (error) {
    console.log(JSON.stringify(error))
    console.error('交易失败:', error)
    return false
  }
}

/**
 * @description solana 交易
 * @param res
 * @param rpc
 * @returns
 */
export const sendSolanaTransaction = async (res: any, rpc: any) => {
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const connection = new Connection(rpc, 'confirmed')
  const transaction = bs58.decode(res.data)
  let tx
  // There are two types of callData, one is the old version and the other is the new version.
  try {
    tx = Transaction.from(transaction)
  } catch (error) {
    tx = VersionedTransaction.deserialize(transaction)
  }

  // Replace the latest block hash
  const recentBlockHash = await connection.getLatestBlockhash()
  if (tx instanceof VersionedTransaction) {
    tx.message.recentBlockhash = recentBlockHash.blockhash
  } else {
    tx.recentBlockhash = recentBlockHash.blockhash
  }

  try {
    const signature = await walletProvider?.sendTransaction(tx, connection)
    // await connection.confirmTransaction(signature, 'confirmed')
    const result = await solanaTransactionReceipt(signature, rpc)
    console.log('Transaction successful with signature:', signature)
    return result ? true : false
  } catch (error) {
    console.error('Failed to send transaction:', error)
    return false
  }
}

/**
 * @description 获取 evm gas
 * @param rpc
 * @returns
 */
export const getEvmGasPrice = async (rpc: any = '') => {
  const web3 = rpc ? new Web3(new Web3.providers.HttpProvider(rpc)) : new Web3(window.ethereum)
  const gwei = await web3.eth.getGasPrice()
  const gasPrice = web3.utils.fromWei(gwei, 'Gwei')
  return gasPrice
}

/**
 * @description 切换钱包网络
 * @param walletType
 * @param sellInfo
 * @returns
 */
export const handelSwitchNetwork = (walletType: any, sellInfo: any) => {
  if (walletType == 'Solana' && sellInfo.chainCode !== 'SOLANA') {
    customMessage({
      type: 'error',
      title: '请断开 Solana 钱包，连接 Evm 钱包'
    })
    return false
  }
  if (walletType == 'Evm' && sellInfo.chainCode == 'SOLANA') {
    customMessage({
      type: 'error',
      title: '请断开 Evm 钱包，连接 Solana 钱包'
    })
    return false
  }
  const networkData = useAppKitNetwork()

  console.log(networkData.value)
  console.log(networkData.value.caipNetwork)
  networkData.value.switchNetwork(CHAIN_NETWORKS[mainNetworkCurrency(sellInfo.chainCode).chainId])
}

/**
 * @description 判断是否是主网货币，进而重置买入卖出币地址
 * @param address
 * @returns
 */
export const resetAddress = (address: any) => {
  const globalStore = useGlobalStore()
  if (address === sol) {
    return '11111111111111111111111111111111'
  } else if (address === okCoin && globalStore.walletInfo.chainId == 501) {
    return '11111111111111111111111111111111'
  } else {
    return address
  }
}

/**
 * @description evm 链上交易确认
 * @param tx
 * @param rpc
 * @param retries
 * @returns
 */
export const evmTransactionReceipt = async (tx: any, rpc: any, retries = 15) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
  for (let i = 0; i < retries; i++) {
    try {
      const receipt = await web3.eth.getTransactionReceipt(tx)
      if (i >= 14) {
        console.error(tx + ':' + JSON.stringify(receipt))
        return '链上确认中，请稍后在历史记录中查询结果'
      }

      if (receipt?.status) {
        console.log(receipt)
        return true
      } else {
        console.error(tx + ':' + JSON.stringify(receipt))
        return false
      }
    } catch (error) {
      console.error(error)
      if (i >= 14) {
        return '链上确认中，请稍后在历史记录中查询结果'
      }
      await delay(1000) // 等待1秒重试
    }
  }
}

/**
 * @description solana 链上交易确认
 * @param tx
 * @param rpc
 * @param retries
 * 测试代码
 * const res = await solanaTransactionReceipt(
      '5UpYyfsC8TE8NpCHCo2Hy3tn2MCBbYQpyt36Q5gfgSqs7LvPEK14WT1btrzY9mP9H6bP9UdMB19J7fmaZfGRuPVP',
      'https://radial-solemn-snowflake.solana-mainnet.quiknode.pro'
    )

    console.log(res)
    notificationWarn({
      title: `${sellInfo.value.baseSymbol}`,
      message: `${res}`
    })
 * @returns
 * 
 */
export const solanaTransactionReceipt = async (tx: any, rpc: any, retries = 15) => {
  const connection = new Connection(rpc, 'confirmed')
  for (let i = 0; i < retries; i++) {
    try {
      const { value } = await connection.getSignatureStatus(tx, { searchTransactionHistory: true })
      if (i >= 14) {
        console.error(tx + ':' + JSON.stringify(value))
        return '链上确认中，请稍后在历史记录中查询结果'
      }

      if (value?.err === null && value?.confirmationStatus?.toLowerCase() !== 'processed') {
        console.log(value)
        return true
      } else if (
        value === null ||
        (value?.err === null && value?.confirmationStatus?.toLowerCase() == 'processed')
      ) {
        await delay(500) // 等待500毫秒重试
      } else {
        console.error(tx + ':' + JSON.stringify(value))
        return false
      }
    } catch (error) {
      console.error(tx + ':' + error)
      if (i >= 14) {
        return '链上确认中，请稍后在历史记录中查询结果'
      }
      await delay(500) // 等待1秒重试
    }
  }
}

/**
 * @description 获取 evm gas
 * @param rpc
 * @returns
 */
export const getEvmGasGwei = async (rpc: any = '') => {
  const web3 = rpc ? new Web3(new Web3.providers.HttpProvider(rpc)) : new Web3(window.ethereum)
  const gwei: any = await web3.eth.getGasPrice()
  const gasPrice = web3.utils.fromWei(gwei, 'Gwei')
  localStorage.setItem('gwei', gwei)
  return {
    gwei,
    gasPrice
  }
}

/**
 * @description evm usdt转账
 * @param recipientAddress 转入目标钱包地址
 * @param tokenAddress 转出地址
 * @param transferAmount 转出数量
 * @param decimals 精度（小数位）
 * @returns
 */
export const evmTransfer = async (
  recipientAddress: any,
  tokenAddress: any,
  transferAmount: any,
  decimals: any
) => {
  console.warn({
    recipientAddress: recipientAddress,
    tokenAddress: tokenAddress,
    transferAmount: transferAmount,
    decimals: decimals
  })
  const { walletProvider }: any = useAppKitProvider('eip155')
  const provider = new BrowserProvider(walletProvider)
  const signer = await provider.getSigner()

  // 创建代币合约实例
  const tokenContract = new Contract(tokenAddress, erc20ABI, signer)
  try {
    // 转账
    const tx = await tokenContract.transfer(recipientAddress, formatUnits(transferAmount, decimals)) // 6 为 USDT 的小数位数
    console.log('Transaction Sent:', tx.hash)

    // 等待交易确认
    await tx.wait()
    console.log('Transaction Confirmed!')
    return true
  } catch (error) {
    console.error('Error during transfer:', error)
    return false
  }
}

/**
 * @description sol usdt转账
 * @param recipientAddress
 * @param tokenAddress
 * @param transferAmount
 * @param decimals
 * @param rpc
 * @returns
 */
export const solanaTransfer = async (
  recipientAddress: any,
  tokenAddress: any,
  transferAmount: any,
  decimals: any,
  rpc: any
) => {
  console.warn({
    recipientAddress,
    tokenAddress,
    transferAmount,
    decimals,
    rpc
  })

  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const connection = new Connection(rpc, 'confirmed')

  const signerAdd: any = walletProvider?.publicKey

  // 山寨币合约地址
  const usdtMintAddress = new PublicKey(tokenAddress)
  //接收方钱包地址
  const recipientPublicKey: any = new PublicKey(recipientAddress)

  const token = new Token(connection, usdtMintAddress, TOKEN_PROGRAM_ID, signerAdd)

  const toToken = new Token(connection, usdtMintAddress, TOKEN_PROGRAM_ID, recipientPublicKey)

  try {
    // 获取发送者的 山寨币 代币账户
    const senderTokenAccount = await token.getOrCreateAssociatedAccountInfo(signerAdd)
    // 获取接收者的 山寨币 代币账户，如果不存在则自动创建
    const recipientTokenAccount = await toToken.getOrCreateAssociatedAccountInfo(recipientPublicKey)

    // 创建转账交易
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        signerAdd,
        [],
        transferAmount * Math.pow(10, decimals) // USDT 有 6 位小数
      )
    )
    const recentBlockHash = await connection.getLatestBlockhash()
    transaction.recentBlockhash = recentBlockHash.blockhash
    transaction.feePayer = signerAdd

    console.log('transaction', transaction)
    // 签名并发送交易
    // const signature = await connection.simulateTransaction(transaction)

    const signature = await walletProvider?.sendTransaction(transaction, connection)

    console.log(signature)
    // await connection.confirmTransaction(signature, 'confirmed')
    const result = await solanaTransactionReceipt(signature, rpc)
    return result ? true : false
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * @description 判断 是否为 evm链 地址
 * @param address
 * @returns
 */
export const isEvmAddress = (address: string) => {
  const web3 = new Web3(window.ethereum)
  return web3.utils.isAddress(address)
}

/**
 * @description 判断 是否为 solana链 地址
 * @param address
 * @returns
 */
export const isSolanaAddress = (address: string) => {
  try {
    // 尝试创建一个PublicKey对象
    const publicKey = new PublicKey(address)
    // 如果没有抛出错误，说明地址是有效的
    return true
  } catch (error) {
    // 如果抛出错误，说明地址无效
    return false
  }
}
