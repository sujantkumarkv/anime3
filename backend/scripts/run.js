const main = async () => {
    const [owner, random]= await hre.ethers.getSigners();
    const animeContractFactory = await hre.ethers.getContractFactory("AnimeList");
    const animeContract = await animeContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.01")
    });

    await animeContract.deployed();

    console.log("Contract deployed to:", animeContract.address);
    console.log("Contract deployed by:", owner.address);


    //contract being funded & it's balance
    let contractBalance= await hre.ethers.provider.getBalance(animeContract.address);


    //animes before a suggestion
    await animeContract.getTotalAnimes();

    //check for balance
    console.log("Contract balance : ", hre.ethers.utils.formatEther(contractBalance));

    let animeSuggestTxn= await animeContract.suggestAnime("Death Note");
    await animeSuggestTxn.wait();

    animeSuggestTxn= await animeContract.connect(random).suggestAnime("One Piece");
    await animeSuggestTxn.wait();

    animeSuggestTxn= await animeContract.connect(random).suggestAnime("Bleach");
    await animeSuggestTxn.wait();

    //check for balance after animeSuggestTxn
    contractBalance= await hre.ethers.provider.getBalance(animeContract.address);
    console.log("Contract balance : ", hre.ethers.utils.formatEther(contractBalance));

    let allAnimeSuggestions= await animeContract.getAllSuggestions();
    console.log(allAnimeSuggestions);

    let totalSuggestions= await animeContract.getTotalAnimes();
    console.log(totalSuggestions);
  };
  
  
const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
runMain();