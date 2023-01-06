import React, { useEffect, useState, useRef } from "react";

import 'bootstrap/dist/css/bootstrap.css';
import {Footer} from './Components/Footer';
import {Container, Row, Col, Card, Button} from "react-bootstrap";

import { ethers } from "ethers";
import "./App.css";
import ABI from "./utils/Anime3.json";

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
  const CONTRACT_ADDRESS= "0xAd198Eb63291Ce58c96b4AA707AAe49C94f76f87";
  const contractABI= ABI;
  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
    
  const [currentAccount, setCurrentAccount]= useState("");
  const [allUpvotes, setAllUpvotes] = useState([]);

  const [animes, setAnimes] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  
  const [animeUpvote, setAnimeUpvote]= useState("");
  
  
  let debounceTimeout= useRef(); //timeout after when user stops typing, useRef() suggested by chatGPT
  useEffect(() => {
    if(search.trim()) //the change in search bar maybe whitespaces also.
    {
      clearTimeout(debounceTimeout.current)
      debounceTimeout.current= setTimeout(() => {
        fetch(`https://gogoanime.consumet.org/search?keyw=${search}`)
        .then(res => res.json())
        .then(data => setResults(data))
        .catch(error => alert(error))
      }, 500); //500ms ~ 0.5seconds timeout after user stops typing to hit api
    }
    else setResults([]) //if it's just whitespaces, show nothing from search
  },[search])


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




  const upvoteAnime= async (animeId) => {
    try{
      const {ethereum}= window;

      if(ethereum){
        const provider= new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const animeContract= new ethers.Contract(
          CONTRACT_ADDRESS, 
          contractABI.abi, 
          signer);

        //let count= await animeContract.getTotalAnimes();
        //console.log("Total anime upvotes fetched: ", count.toNumber());

        setAnimeUpvote(animeId); //setting the to-be-upvoted as animeId -> it's unique
        // UPVOTING ANIME i.e., SENDING TXN TO BLOCKCHAIN
        const upvoteAnimeTxn= await animeContract.upvoteAnime(animeUpvote, 
                                                                {gasLimit: 300000});
        console.log("Mining txn....");
  
        await upvoteAnimeTxn.wait();
        console.log("Mined ---", upvoteAnimeTxn.hash);
        
        //count= await animeContract.getTotalAnimes();
        //console.log("Toal animes upvotes....", count.toNumber());
      }
      else
        console.log("Ethereum object doesn't exist!");
      
    }catch(err){
      console.error(err);
    }
  }

/* 

 const getAllUpvotes= async() => {
       
    try{
      const {ethereum}= window;

      if(ethereum){
        const provider= new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const animeContract= new ethers.Contract(
          CONTRACT_ADDRESS, 
          ABI.abi, 
          signer);

        const allUpvotes= await animeContract.getAllUpvotes();

        const AnimeList = allUpvotes.map(anime => {
        return {
          address: anime.suggestor,
          timestamp: new Date(anime.timestamp * 1000),
          message: anime.message,
        };
      });
        setAllUpvotes(AnimeList);

        animeContract.on("newSuggestion", (from, timestamp, message)=> {
          console.log("newSuggestion", from, timestamp, message);
          setAllUpvotes(prevState => [
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

*/
  const getAllUpvotesCount= async() => {
        
    try{
      const {ethereum}= window;

      if(ethereum){
        const provider= new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const animeContract= new ethers.Contract(
          CONTRACT_ADDRESS, 
          ABI.abi, 
          signer);

        const allUpvotesCount= await animeContract.getAllUpvotesCount();
        alert(`The total upvotes so far:${allUpvotesCount.toNumber()}`); //uint256 returned is in hex
        

      } else
        console.log("Ethereum object doesn't exist!");
      
    }catch(err){
      console.error(err);
    }
  }

  
  
  useEffect(() => {
    checkIfWalletIsConnected();
    //getAllUpvotes(); //read from chain
    }, []);


  const handleChange = event => {
    setSearch(event.target.value);
    //If search changes, we can't change suggested anime yet, bcz only from the list
    //shown, when the user clicks on suggest, then the txn is confirmed.
    //setAnimeSuggestion(event.target.value);
  };
  
  

  
  return (
    <>
    <div className="AppContainer" >
      <div className="dataContainer">
        <h1 className="AppTitle">Anime3</h1>
        <div className="connectWallet">
          {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        </div>
        <div className="bio">
          For the WEB3 X ANIME community.
          <br/>Upvote & make your group upvote your favorite animes<br/> to the community and make it the top rated here.
        </div>
        <div>
        <Button variant="primary" onClick={() => getAllUpvotesCount()}>Get all time Upvotes count</Button>
      </div>
        <div className="animeSearch">
          <p>Didn't find yours in the Top10 below? Search here  👇</p>
        <form action="">
          <input type="text" className="animeSearchInput" 
                placeholder="Search your favorite anime" name="searchInput" 
                value={search} onChange={handleChange} />
        </form>
      </div>
      
      
      <Container>
        <Row className="results justify-content-center" id="results">
        {results.map(anime => {
          return(
          <Col key={anime.animeId} className="result">
            <Card className="card" >
              <Card.Img className="cardImpTop" variant="top" src={anime.animeImg} />
                  <Card.Body className="cardBody">
                    
                    <Card.Title className="cardTitle">{anime.animeTitle}</Card.Title>
                    
                {/* without the ()=> in onClick={() => {}},  */}
                <Button variant="primary" onClick={() => upvoteAnime(anime.animeId)}>Upvote</Button> 
              </Card.Body>
            </Card> 
          </Col>
        )
        })
        }
        </Row>
      </Container> 
      <Footer />
      </div> 

      
    </div>

  
    </>
     
  );
};

export default App;