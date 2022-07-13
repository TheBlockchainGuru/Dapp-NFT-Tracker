import { getAllByNFTPort } from "../Apis/nftport";
import { getTransactionInformation, weiToEther, compareTwoAddress } from "../web3utils";
import { getAsset } from "../Apis/opensea"
import { getNftMetadata } from "../Apis/alchemy";
import { useDispatch } from "react-redux";

export const getNftInfos = async (address, setting) => {
  const nfts = await getAllByNFTPort(address);
  const today = new Date();

  const filterByTime = nfts.filter((nft, key) => {
    return byTimeFrame(nft.transaction_date, today, setting.timeFrame)
  })

  let filterByType = [];
  if(setting.pageIndex === 'history') {
    filterByType = filterByTime.filter((nft, key) => {
      switch(setting.actionType) {
        case "all":
          return true;
        case "mint":
          return nft.type.toLowerCase().includes('mint');
        case "buy":
          return nft.type === 'sale' && compareTwoAddress(address, nft.buyer_address);
        case "sell": 
          return nft.type === 'sale' && !compareTwoAddress(address, nft.buyer_address);
        case "transfer":
          return nft.type.toLowerCase().includes('transfer')
        default: 
          return false;
      }
    } )
  } else if(setting.pageIndex === 'gains') {
    filterByType = filterByTime.filter((nft, key) => {
      return true;
    })

  } else {
    return [];
  }

  const nftCount = [...filterByType].length;
  let totalRevenue = 0, 
      totalCostBasis = 0, 
      realizedShortTermGains = 0, 
      realizedLongTermGains = 0, 
      totalRealizedGains = 0, 
      realizedRoi = 0;

  for (let i = 0; i < filterByType.length; i++) {
    const row = filterByType[i];

    totalRevenue += parseFloat((row.type === 'sell' ? row.value : 0));
    totalCostBasis += parseFloat(
        (row.type === 'buy' || row.type == 'mint') ? 
        (parseFloat(row.value) + parseFloat(row.gastotal)) : 0);
    realizedShortTermGains = 0;
    realizedLongTermGains = 0;
    totalRealizedGains = 0;
    realizedRoi = 0;
  }
  let filterFinal =  filterByType.filter((nft, key) => {
    return key >= ((setting.currentPage - 1) * setting.perPage) && key < (setting.currentPage * setting.perPage)
  })
  let promises = []
  
  for (let i = 0; i < filterFinal.length; i++) {
    filterFinal[i].index = i
      
      let event_type = filterFinal[i].type
      if (event_type == "sale") {
        if (compareTwoAddress(address, filterFinal[i].buyer_address)) {
          filterFinal[i].type = "buy"
        } else {
          filterFinal[i].type = "sell"
        }
      }

      let contract_address, token_id
      if (event_type == "sale" || event_type == "cancel_list" || event_type == "list") {
        contract_address = filterFinal[i].nft.contract_address
        token_id = filterFinal[i].nft.token_id
      } else {
        contract_address = filterFinal[i].contract_address
        token_id = filterFinal[i].token_id
      }

      /* alchemy */
      const promise1 = getNftMetadata(
        contract_address,
        token_id
      ).then((res) => {

        if (res.metadata.name == null || res.metadata.image == null) {
          const promise3 = getAsset(
            contract_address,
            token_id
          ).then((res) => {

            if (res.data.name == null) {
              filterFinal[i].name = res.data.collection.name;
              filterFinal[i].image = res.data.image_url;
            } else {
              filterFinal[i].name = res.data.name;
              filterFinal[i].image = res.data.image_url;
            }
          })
          promises.push(promise3)
        } else {
          filterFinal[i].name = res.metadata.name;
          filterFinal[i].image = res.metadata.image;
        }
      })
      
      promises.push(promise1);

      const promise2 = getTransactionInformation(
        filterFinal[i].transaction_hash
      ).then((res) => {
        filterFinal[i].value = res.value;
        filterFinal[i].gasprice = res.gasprice;
        filterFinal[i].gastotal = res.gastotal;
      });
      
      promises.push(promise2);
      await Promise.all(promises);
  }

  const result = { 
    nfts: filterFinal, 
    nftCount: nftCount,
    totalRevenue: totalRevenue,
    totalCostBasis: totalCostBasis,
    realizedShortTermGains: realizedShortTermGains,
    realizedLongTermGains: realizedLongTermGains,
    totalRealizedGains: totalRealizedGains,
    realizedRoi: realizedRoi,
  };

  return result;
}

function byTimeFrame(startDate, endDate, timeFrame) {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  const timeDiff = date2 - date1;
  return timeDiff <= (timeFrame * 1000 * 60 * 60 * 24);
}