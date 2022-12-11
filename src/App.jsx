import React, { useEffect, useState } from "react";

import { ethers } from "ethers";
import "./App.css";
import ABI from "./utils/AnimeList.json";

const getEthereumObject = () => window.ethereum;

const findMetamaskAccount= async () => {
  try{
    const ethereum= getEthereumObject();
    if (!ethereum) {
      console.error("Make sure you have metamask!");
      return null;
    }
    
    console.log("We have the ethereum object", ethereum);
    const accounts= await ethereum.request({method: "eth_accounts"}); //array
    if(accounts.length !== 0){  //account exists
      const account= accounts[0];
      console.log("Valid ethereum account found");
      return account;
    }
    else{
      console.error("No valid ethereum account found");
      return null;
    }  
}
  catch(err){
    console.error(err);
    return null;
  };
}
  
const App = () => {
  const CONTRACT_ADDRESS= "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI= ABI;
  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
    
  const [currentAccount, setCurrentAccount]= useState("");
  const [allSuggestions, setAllSuggestions] = useState([]);

  const [animes ,setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  
  const [animeSuggestion, setAnimeSuggestion]= useState("");
  
  
  const connectWallet= async () =>{
    try{
      const ethereum= getEthereumObject();
      if(!ethereum){
        alert("Get Metamask");
        return null;
      }

      const accounts= await ethereum.request({method: "eth_requestAccounts"});
      const account= accounts[0];
      console.log("connected", account);
      setCurrentAccount(account);
    }catch(err){
      console.error(err);
    }  
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }


  const suggestAnime= async () => {
    try{
      const {ethereum}= window;

      if(ethereum){
        const provider= new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const animeContract= new ethers.Contract(
          CONTRACT_ADDRESS, 
          ABI.abi, 
          signer);

        //let count= await animeContract.getTotalAnimes();
        //console.log("Total anime suggestions fetched: ", count.toNumber());

        // SUGGESTING ANIME i.e., SENDING TXN TO BLOCKCHAIN
        const suggestAnimeTxn= await animeContract.suggestAnime(animeSuggestion, 
                                                                {gasLimit: 300000});
        console.log("Mining txn....");
  
        await suggestAnimeTxn.wait();
        console.log("Mined ---", suggestAnimeTxn.hash);
        
        //count= await animeContract.getTotalAnimes();
        //console.log("Toal animes suggestions....", count.toNumber());
      }
      else
        console.log("Ethereum object doesn't exist!");
      
    }catch(err){
      console.error(err);
    }
  }


  const getAllSuggestions= async() => {
       
    try{
      const {ethereum}= window;

      if(ethereum){
        const provider= new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const animeContract= new ethers.Contract(
          CONTRACT_ADDRESS, 
          ABI.abi, 
          signer);

        const allSuggestions= await animeContract.getAllSuggestions();

        const AnimeList = allSuggestions.map(anime => {
        return {
          address: anime.suggestor,
          timestamp: new Date(anime.timestamp * 1000),
          message: anime.message,
        };
      });
        setAllSuggestions(AnimeList);

        animeContract.on("newSuggestion", (from, timestamp, message)=> {
          console.log("newSuggestion", from, timestamp, message);
          setAllSuggestions(prevState => [
          ...prevState,
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
          },
        ]);   
     });
      } else
        console.log("Ethereum object doesn't exist!");
      
    }catch(err){
      console.error(err);
    }
  }

  
  
  useEffect(() => {
    checkIfWalletIsConnected();
    getAllSuggestions(); //read from chain
    }, []);

  useEffect(() => {
    fetch(`https://gogoanime.consumet.org/search?keyw=${}`)
    .then(res=>{
       setCoins(res.data)
       console.log(res.data)
    }).catch(error=>console.log(error))
  }, [])

  const handleChange = event => {
    setSearch(event.target.Value);
    setAnimeSuggestion(event.target.value);
  };

  return (
    <div className="AppContainer" >
      <div className="dataContainer">
        <h1 className="AppTitle">Anime3</h1> 
        <div className="bio">
          For the WEB3 X ANIME community.
          <p>Suggest & make your group suggest your favorite animes to the community & make it the 
          top rated here.</p>
        </div>
      
        <div className="animeSearch">
        <form action="">
          <input type="text" className="animeSearchInput" 
                placeholder="Search your favorite anime" name="searchInput" 
                value={animeSuggestion} onChange={handleChange}
                />
        </form>
      </div>
        
        <button className="waveButton" onClick={suggestAnime}>
          Suggest me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
        {allSuggestions.map((anime, index) => {
          return (
            <div style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {anime.address}</div>
              <div>Time: {anime.timestamp.toString()}</div>
              <div>Message: {anime.message}</div>
            </div>)
        })}
      </div> 
    </div>
  );
};

export default App;