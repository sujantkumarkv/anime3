const main = async () => {
    const [owner, random]= await hre.ethers.getSigners();
    const animeContractFactory = await hre.ethers.getContractFactory("Anime3");
    const animeContract = await animeContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.01")
    });

    await animeContract.deployed();

    console.log("Contract deployed to:", animeContract.address);
    console.log("Contract deployed by:", owner.address);


    //contract being funded & it's balance
    let contractBalance= await hre.ethers.provider.getBalance(animeContract.address);


    //animes before a suggestion
    let upvoteCount= await animeContract.getAllUpvotesCount();
    console.log(upvoteCount)

    //check for balance
    console.log("Contract balance : ", hre.ethers.utils.formatEther(contractBalance));

    let animeUpvoteTxn= await animeContract.upvoteAnime("Death Note");
    await animeUpvoteTxn.wait();

    animeUpvoteTxn= await animeContract.connect(random).upvoteAnime("One Piece");
    await animeUpvoteTxn.wait();

    animeUpvoteTxn= await animeContract.connect(random).upvoteAnime("Bleach");
    await animeUpvoteTxn.wait();

    //check for balance after animeSuggestTxn
    contractBalance= await hre.ethers.provider.getBalance(animeContract.address);
    console.log("Contract balance : ", hre.ethers.utils.formatEther(contractBalance));

    //let allAnimeSuggestions= await animeContract.getAllSuggestions();
    //console.log(allAnimeSuggestions);

    let allUpvotesCount= (await animeContract.getAllUpvotesCount()).toNumber();
    console.log("Total anime upvotes", allUpvotesCount);


    //show all upvotes till now
    let allUpvotes= await animeContract.showAllAnimeUpvotes();
    console.log(typeof(allUpvotes[0])); //typeof -> object & allUpvotes[0].length -> 4, the 4 props I gave.
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