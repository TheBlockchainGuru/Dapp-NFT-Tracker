import { resolve } from 'path';
import { getCorsUrl } from './common';

const Moralis = require('moralis');
const serverUrl = getCorsUrl("https://fzdpmm776y4a.usemoralis.com:2053/server");
const appId = "axqXpaSaMLRI2iBWbVPxr611TDoI2baGWF0Blgot";

Moralis.start({ serverUrl, appId });


export const getMintInfo = async (address) => {
  let mint_array = []
  const options = { 
    chain: "eth", 
    address: address ,
    limit: "500" 
  };

//   console.log("   starting to check Mint transactions...\n")
  let transfersNFT = await Moralis.Web3API.account.getNFTTransfers(options);
  transfersNFT = transfersNFT.result
//   console.log("      Number of Transactions that related with NFT...\n", transfersNFT.length)
  for (let i = 0; i < transfersNFT.length; i++) {
      if (transfersNFT[i].from_address === "0x0000000000000000000000000000000000000000") {
          mint_array.push({data : transfersNFT[i]})
      }
  }

  return mint_array;
}

export const getNFTMetadata = async (address, tokenid) => {
    const options = { address: address, token_id: tokenid, chain: "eth" };
    // return new Promise((resolve, reject) => {
        return await Moralis.Web3API.token.getTokenIdMetadata(options).catch(err => {
            console.error(err)
        });

    // }); 
}

export const getOpenseaAsset = async (address, tokenid) => {
    const options = {
        network: "mainnet",
        tokenAddress: address,
        tokenId: tokenid
    }
    return await Moralis.Plugins.opensea.getAsset(options).catch(err => {
        console.error(err);
    })
}

export const getEtherTransfers = async (address) => {
    const options = {
        chain: "eth",
        address: address
    }

    return await Moralis.Web3API.account.getTokenTransfers(options).catch(err => {
        console.error(err);
    })
    
    // const options = {
    //     chain: "eth",
    //     address: address,
    //     order: "desc",
    //     from_block: "0"
    // }

    // return await Moralis.Web3API.account.getTransactions(options).catch(err => {
    //     console.error(err);
    // })
}

export const getTokenInformation = async (tokenAddress) => {
    const options = {
        chain: "bsc",
        addresses: tokenAddress
    }

    return await Moralis.Web3API.token.getTokenMetadata(options).catch(err => {
        console.error(err);
    });
}

export const getTokenPrice = async (tokenAddress) => {
    const options = {
        address: tokenAddress,
        chain: "bsc",
        exchange: "PancakeSwapv1"
    }

    return await Moralis.Web3API.token.getTokenPrice(options).catch(err => {
        console.error(err)
    })
}

export const getWalletTokenIdTransfers = async (tokenAddress) => {
    const options = {
        address: tokenAddress,
        token_id: "1",
        chain: "eth",
    }
}

export const getETHHistoricalTransactions = async (walletAddress) => {
    const query = new Moralis.Query("EthTransactions");
    query.equalTo("from_address", walletAddress);
    const results = await query.find();

    return results;
}