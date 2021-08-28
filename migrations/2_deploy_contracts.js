const QuissceQoin = artifacts.require("QuissceQoin");
const QuissceDads = artifacts.require("QuissceDads");
const QuissceDadDollars = artifacts.require("QuissceDadDollars");

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(QuissceQoin);
    const quissceQoin = await QuissceQoin.deployed();

    await deployer.deploy(QuissceDads, quissceQoin.address);
    const quissceDads = await QuissceDads.deployed();

    await deployer.deploy(QuissceDadDollars, quissceDads.address);

    await quissceQoin.transfer(accounts[1], '200000000000000000000000');
    await quissceQoin.transfer(accounts[2], '200000000000000000000000');
}