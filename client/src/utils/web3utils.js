import Web3 from "web3";

const web3 = new Web3(
  "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);

export const weiToEther = (wei) => {
  const etherValue = Web3.utils.fromWei(wei, "ether");
  return etherValue;
};

export const toDefaultAddress = (address) => {
  try {
    const val = web3.utils.toChecksumAddress(address)
    return val
  } catch {
    return false
  }
}

// const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFloat = (e) => {
  e = parseFloat(e);
  e = e ? e : 0;
  return e;
};

export const getTransactionInformation = async (hash) => {
  let res, value, gasprice, gasused, gastotal;
  res = await web3.eth.getTransaction(hash).catch((err) => {
    console.error(err);
  });

  value = weiToEther(res.value);

  gasprice = res.gasPrice;
  res = await web3.eth.getTransactionReceipt(hash).catch((err) => {
    console.error(err);
  });
  gasused = res.gasUsed;
  gastotal = getFloat(gasprice) * getFloat(gasused);

  gasprice = weiToEther(gasprice)
  gastotal = weiToEther(gastotal.toString())
  return {
    value,
    gasprice,
    gastotal,
  };
};

export const compareTwoAddress = (one, two) => {
  if (one.toString().toUpperCase() === two.toString().toUpperCase()) {
    return true
  } else {
    return false
  }
}