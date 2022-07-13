const path = require('path')
// export const corsUrl = 'https://arcane-eyrie-83731.herokuapp.com/'
export const corsUrl = 'https://limitless-cliffs-36961.herokuapp.com/'


export const getInt = (str) => {
  let val = parseInt(str)
  val = !val ? 0 : val
  return val
}

export const getFloat = (str) => {
  let val = parseFloat(str)
  val = !val ? 0 : val
  return val
}

export const getCorsUrl = (url) => {
  return corsUrl + url
};

export const getPinataUrl = url => {
  if (!url) return ''
  if (url.includes("ipfs://")) url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
  if (url.includes("gateway.pinata.cloud")) url = url.replace("gateway.pinata.cloud", "ipfs.io")
  return url
}

export const isVideoFile = filePath => {
  const extensions = ['MP4', 'MOV', 'WMV', 'FLV', 'AVI'].map(ext => ext.toLowerCase())
  const fileExtension = path.extname(filePath).substring(1).toLowerCase()
  return extensions.indexOf(fileExtension) > -1
}

export const fetchPrice = (orders, owner) => {
  let auction = false
  let price = ''
  let notForSale = false
  let on_sale = false
  // Check if item is for sale for wide audience (we don't count private listings)
  // Some items maybe both on sale and in auction, in that case we show only sale price
  if (
    // Check if there are some listings by creator
    orders &&
    orders.filter(function (el) {
      return el.maker.address === owner.address
    }).length > 0
  ) {
    let smallest_curr = ''
    let smallest_price = 10 ** 31
    for (let i = 0; i < orders.length; i++) {
      if (
        // Check if this is listing by creator and it is not private, and price is smaller than current smallest, and it is not auction
        parseInt(orders[i].base_price, 10) < smallest_price &&
        orders[i].maker.address === owner.address &&
        orders[i].taker.address ===
        '0x0000000000000000000000000000000000000000' &&
        orders[i].v != null
      ) {
        smallest_price = parseInt(orders[i].base_price, 10)
        smallest_curr = orders[i].payment_token_contract.symbol
      }
    }
    if (smallest_curr !== '') {
      on_sale = true
      price = '' + (smallest_price / 10 ** 18).toFixed(2) + ' ' + smallest_curr
    }
  }
  // Check if item is in Auction
  if (
    !on_sale &&
    orders &&
    orders.filter(function (el) {
      return el.v == null
    }).length > 0
  ) {
    // Auction
    auction = true
    let biggest_curr = ''
    let biggest_bid = 0
    // Find the biggest bid
    for (let i = 0; i < orders.length; i++) {
      if (
        // Check if this is offer, and bid is bigger than current biggest
        parseInt(orders[i].base_price, 10) > biggest_bid &&
        orders[i].maker.address !== owner.address
      ) {
        biggest_bid = parseInt(orders[i].base_price, 10)
        biggest_curr = orders[i].payment_token_contract.symbol
      }
    }
    if (biggest_curr !== '') {
      price = '' + (biggest_bid / 10 ** 18).toFixed(2) + ' ' + biggest_curr
    } else {
      price = 'No bids'
    }
  }
  // Not for sale
  if (!on_sale && !auction) {
    notForSale = true
    price = 'Not for sale'
  }
  return { price, auction, notForSale }
}