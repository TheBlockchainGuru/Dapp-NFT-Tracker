export const makeWalletAddress = (_str, start = 20, end = 4) => {
    if (_str.length > 0) {
      const str_address =
        _str.substring(0, start) +
        "..." +
        _str.substring(_str.length - end, _str.length);
      return str_address;
    }
};

export const convertDate = (_str) => {
  const mydate = new Date(_str);
  const month = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
  const str = month + ' ' + mydate.getDate() + ', ' + mydate.getFullYear();

  return str;
}

export const getRoi = (cost, revenue) => {
  if(isNaN(cost) || isNaN(revenue)) {
    return '-';
  } else {
    if(parseInt(cost) == 0) {
      return '-'
    } else {
      const roi = ((parseFloat(revenue) - parseFloat(cost)) / parseFloat(cost) * 100).toFixed(4)
      return roi
    }
  }
}

export const filterSameTransactions = (assetArrays) => {
  let i = 0;
  while ( i < assetArrays.length ) {
      const result = assetArrays.filter(asset => asset.transaction_hash == assetArrays[i].transaction_hash )

      for ( let j = 0; j < result.length; j++ ) {
          assetArrays[result[j].index].value = assetArrays[result[j].index].value / result.length
          assetArrays[result[j].index].gastotal = assetArrays[result[j].index].gastotal / result.length
      }

      i = i + result.length
  }
}

export const checkTransferType = (nftarray, wallets) => {
  for (let i = 0; i < nftarray.length; i++) {
    let type = nftarray[i].type
    let from = nftarray[i].transfer_from
    let to = nftarray[i].transfer_to

    switch (type) {
      case "transfer":
        nftarray[i].sent_from = nftarray[i].transfer_from
        nftarray[i].sent_to = nftarray[i].transfer_to
        break;
      case "mint":
        nftarray[i].sent_from = nftarray[i].owner_address
        nftarray[i].sent_to = nftarray[i].contract_address
        break;
      default:
        nftarray[i].sent_from = nftarray[i].seller_address
        nftarray[i].sent_to = nftarray[i].buyer_address
        break;
    }

    if (type == "sell") {
      nftarray[i].revenue = nftarray[i].value
    } else {
      nftarray[i].revenue = "-"
    }

    if (type == "buy" || type == "mint") {
      nftarray[i].cost = nftarray[i].value + nftarray[i].gastotal
    } else {
      nftarray[i].cost = "-"
    }

    if (type == "transfer") {
      if (checkMyWallet(from, wallets) & checkMyWallet(to, wallets)) {
        nftarray[i].type = "Internal Transfer"
      } else if (checkMyWallet(from, wallets)) {
        nftarray[i].type = "Transfer Out"
      } else {
        nftarray[i].type = "Transfer In"
      }
    }
  }
}

const checkMyWallet = (val, wallets) => {
  for (var i=0; i<wallets.length; i++) {
      if (wallets[i].address.toString().toUpperCase() === val.toString().toUpperCase())
          return true
  }

  return false
}

export const removeSaleInTransfer = (sales, transfers) => {
  var newArray  = []
  for (let i=0; i < transfers.length; i++) {
      let flag = false
      for (let j=0; j < sales.length; j++) {
          if (sales[j].timeStamp == transfers[i].timeStamp & sales[j].transactionHash == transfers[i].transactionHash) {
              flag = true
              break
          }
      }

      if (!flag) {
          newArray.push(transfers[i])
      }
  }

  return newArray
}
