const config = require("../truffle-config");
const WwanToken = artifacts.require('WwanToken');
const UniswapV2Factory = artifacts.require('UniswapV2Factory');
const UniswapV2Router01 = artifacts.require('UniswapV2Router01');
const UniswapV2Router02 = artifacts.require('UniswapV2Router02');

module.exports = async (deployer, network, accounts) => {
  console.log(`...network = ${network}`)
  global.network = network;
  const [owner, admin, other] = accounts;
  const networkConfig = config.networks[network]

  // deploy wwan
  await deployer.deploy(WwanToken);
  const wwan = await WwanToken.deployed();
  console.log("wwan: " + wwan.address);

  // deploy factory
  let feeAccount = other;
  if (networkConfig && networkConfig.feeToSetter) {
    feeAccount = networkConfig.feeToSetter
  }
  console.log(`feeAccount = ${feeAccount}`)
  await deployer.deploy(UniswapV2Factory, feeAccount);
  const uniswapV2Factory = await UniswapV2Factory.deployed();
  console.log(`uniswapV2Factory = ${uniswapV2Factory.address}`)

  const WWan = wwan.address;
  const Factory = uniswapV2Factory.address;

  // deploy router
  await deployer.deploy(UniswapV2Router01, Factory, WWan);
  const uniswapV2Routor01 = await UniswapV2Router01.deployed();
  console.log(`UniswapV2Router01 = ${uniswapV2Routor01.address}`)

  // deploy router 2
  await deployer.deploy(UniswapV2Router02, Factory, WWan);
  const uniswapV2Routor02 = await UniswapV2Router02.deployed();
  console.log(`UniswapV2Router02 = ${uniswapV2Routor02.address}`)
};
