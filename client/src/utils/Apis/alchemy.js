import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// Using HTTPS
const web3 = createAlchemyWeb3(
  "https://eth-mainnet.alchemyapi.io/v2/DXKD8MZtAEoT508AiPj0rEocvhcwjy5P",
);

export const getNftMetadata = async (contractaddress, tokenid) => {
    return await web3.alchemy.getNftMetadata({
        contractAddress: contractaddress,
        tokenId: tokenid
    });
}

export const getNftsOfOwner = async (owneraddress) => {
    return await web3.alchemy.getNfts({
        owner: owneraddress
    });
}

export const getEtherTransfers = async (walletAddress) => {
    // console.log("222")
    
    const option = {
        fromBlock: "0x000000",
        toBlock: "0x5F5E0FF",
        fromAddress: walletAddress,
        // contractAddresses: [
        //   "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
        // ],
        maxCount: "100",
        excludeZeroValue: true,
        category: [
          "external",
          "token"
        ]
        // pageKey: "d434713b-c83d-4a43-9c72-52a6e43d9139"
    }

    web3.alchemy.getAssetTransfers(option).then((res) => {
        // console.log(res)
        return res
    }).catch((err) => {
        return err
    })
}