import axios from "axios";
import { getCorsUrl } from "./common";
const apiKey = "0474fa03-f6e5-4705-a828-b6dc3f24727b";

export const getMintByNFTPort = async (walletAddress) => {
  try {
    const response = await axios.get(
      getCorsUrl(
        `https://api.nftport.xyz/v0/transactions/accounts/${walletAddress}?chain=ethereum&type=mint`
      ),
      {
        headers: { Authorization: apiKey },
      }
    );

    // console.log(response);

    if (response.data.response == "OK") {
      return {
        data: response.data.transactions,
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (e) {
    return {
      success: false,
    };
  }
};

export const getNFTMetadataByNFTPort = async (contractAddress, tokenId) => {
  try {
    const response = await axios.get(
      getCorsUrl(
        `https://api.nftport.xyz/v0/nfts/${contractAddress}/${tokenId}?chain=ethereum`
      ),
      {
        headers: { Authorization: apiKey },
      }
    );

    // console.log(response);

    if (response.data.response == "OK") {
      return {
        data: response.data,
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (e) {
    return {
      success: false,
    };
  }
};

export const getAllByNFTPort = async (walletAddress) => {
  let continuation = "";
  let transactions = [];

  do {
    const response = await axios.get(
      getCorsUrl(
        `https://api.nftport.xyz/v0/transactions/accounts/${walletAddress}?chain=ethereum&type=all&continuation=${continuation}`
      ),
      {
        headers: { Authorization: apiKey },
      }
    );

    console.log(response)
    if (
      response.status !== 200 ||
      !response.data ||
      !response.data.transactions
    )
      break;
    transactions = transactions.concat(response.data.transactions);
    continuation = response.data.continuation;
    // console.log("transactions: ", transactions);
  } while (continuation);

  // console.log("end");
  return transactions;
};
