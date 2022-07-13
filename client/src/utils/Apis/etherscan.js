import { ethers } from 'ethers'
import axios from 'axios'
import { getCorsUrl, getPinataUrl } from './common'
import { resolve } from 'path'

const apiKey = '3KR3QB1T46GYWMING2CFTN6FPZEBT7SIRV'
let contracts = {}

export const getContract = async address => {
  if (!contracts[address]) {
    let response
    response = await axios.get(getCorsUrl(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`))
    if (response.status !== 200) return { status: 0 }
    const abi = response.data.result
    const provider = new ethers.providers.EtherscanProvider("homestead", apiKey)
    const contract = new ethers.Contract(address, abi, provider)
    contracts[address] = contract
  }
  return contracts[address]
}

export const getTotalSupply = async address => {
  try {
    let response
    const contract = await getContract(address)
    // console.log('contract', contract)
    response = await contract.functions.totalSupply()
    if (!response.length) return 0
    const totalSupply = parseInt(response[0]._hex, 16)
    // console.log('totalSupply', totalSupply)
    return totalSupply
  } catch {
    return 0
  }
}

// export const getTokenMetadata = async (address, tokenId) => {
//   try {
//     console.log('getTokenMetadata', address, tokenId)
//     let response
//     const contract = await getContract(address)
//     response = await contract.functions.tokenURI(tokenId)
//     if (!response.length) return { status: 0 }
//     const tokenURI = response[0]
//     console.log('tokenURI', tokenURI)
//     response = await axios.get(getCorsUrl(getPinataUrl(tokenURI)))
//     return { status: response.status, data: response.data }
//   } catch {
//     return { status: 0 }
//   }
// }

export const getTokenMetadata = async (address, tokenId) => {
  try {
    let response
    const contract = await getContract(address)
    response = await contract.functions.tokenURI(tokenId)
    if (!response.length) return { status: 0 }
    const tokenURI = response[0]
    response = await axios.get(getCorsUrl(getPinataUrl(tokenURI)))
    return { status: response.status, data: response.data }
  } catch {
    return { status: 0 }
  }
}