import axios from 'axios';
import { getCorsUrl } from './common';
const apiKey = '47737e2229ae45d9a106a1ab71c84ca6'

export const getCollections = async (offset) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/collections?offset=${offset}&limit=300`), {
      headers: { 'X-API-KEY': apiKey }
    })
    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export const getSingleContract = async (contractAddress) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/asset_contract/${contractAddress}`), {
      headers: { 'X-API-KEY': apiKey }
    })
    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export const getSingleCollection = async (slug) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/collection/${slug}`), {
      headers: { 'X-API-KEY': apiKey }
    })
    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export const getAssets = async (contractAddress, offset) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/assets?asset_contract_address=${contractAddress}&order_direction=desc&offset=${offset}&limit=50`), {
      headers: { 'X-API-KEY': apiKey }
    })
    if (response.status === 200 && response.data.assets && response.data.assets.length) {
      return {
        data: response.data.assets,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export const getAsset = async (contractAddress, tokenId) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`), {
      headers: { 'X-API-KEY': apiKey }
    })
    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }
}

export const getSalesEvent = async (walletAddress) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/events?account_address=${walletAddress}&event_type=successful`), {
      headers: { 'X-API-KEY': apiKey }
    })

    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }  
}

export const getTransferEvent = async (walletAddress) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/events?account_address=${walletAddress}&event_type=transfer`), {
      headers: { 'X-API-KEY': apiKey }
    })

    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }  
}


export const loadInfo = async ({
  contractAddress,
  setCollectionInfo,
}) => {
  let response
  if (!contractAddress) return { errorMsg: 'Input contract address' }
  // get single contract.
  response = await getSingleContract(contractAddress)
  if (!response.success) return { errorMsg: 'Invalid contract' }
  const singleContract = response.data
  // console.log('singleContract', singleContract)
  // get single collection.
  response = await getSingleCollection(singleContract.collection.slug)
  if (!response.success) return { errorMsg: 'Invalid collection' }
  const singleCollection = response.data.collection
  // console.log('singleCollection', singleCollection)
  setCollectionInfo(singleCollection)
  return { success: true }
}

export const getAuctionEvent = async (walletAddress) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/events?account_address=${walletAddress}&event_type=created`), {
      headers: { 'X-API-KEY': apiKey }
    })

    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }  
}

export const getApproveEvent = async (walletAddress) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/events?account_address=${walletAddress}&event_type=approve`), {
      headers: { 'X-API-KEY': apiKey }
    })

    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }    
}

export const getEvent = async (walletAddress, eventName) => {
  try {
    const response = await axios.get(getCorsUrl(`https://api.opensea.io/api/v1/events?account_address=${walletAddress}&event_type=${eventName}`), {
      headers: { 'X-API-KEY': apiKey }
    })

    if (response.status === 200) {
      return {
        data: response.data,
        success: true
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    return {
      success: false
    }
  }    
}