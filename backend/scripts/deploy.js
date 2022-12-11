const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const animeContractFactory = await hre.ethers.getContractFactory("AnimeList");
    const animeContract = await animeContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1")
    });
    await animeContract.deployed();
  
    console.log("AnimeList address: ", animeContract.address);
  };
  
const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
runMain();