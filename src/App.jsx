import React, { useEffect, useState, useRef } from "react";

import 'bootstrap/dist/css/bootstrap.css';
import {Footer} from './Components/Footer';
import {Container, Row, Col, Card, Button,
        Pagination, ToggleButton, ToggleButtonGroup, ButtonGroup} from "react-bootstrap";

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
  const CONTRACT_ADDRESS= "0x440F5a6d7D1B8D4caA45F641a807718bA55216a6";
  const contractABI= ABI;
  /*
   * The passed callback function will be run when the page loads.
   * More technically, when the App component "mounts".
   */
    
  const [currentAccount, setCurrentAccount]= useState("");

  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [totalUpvotesCount, setTotalUpvotesCount]= useState(0);
  const [isBeingSearched, setIsBeingSearched]= useState(false);
  const [allTimeToggle, setAllTimeToggle]= useState(false);

  
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




  const upvoteAnime= async (animeId, animeTitle, animeImg, animeUrl) => {
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
        if(animeId) console.log(animeId);

        // UPVOTING ANIME i.e., SENDING TXN TO BLOCKCHAIN
        const upvoteAnimeTxn= await animeContract.upvoteAnime(animeId, animeTitle, animeImg, animeUrl,
                                                                {gasLimit: 900000});
        console.log("Mining txn....");
        alert("Hang on!! Upvoting mines an on-chain transaction and will take a while...")

        await upvoteAnimeTxn.wait();
        console.log("Mined ---", upvoteAnimeTxn.hash);
        alert(`"${animeTitle}" was upvoted successfully!!!`)
        updateAllUpvotes(); //call it to update the list displayed. WORKS :)
      }
      else
        console.log("Ethereum object doesn't exist!");
      
    }catch(err){
      console.error(err);
    }
  }


  const updateAllUpvotes= async() => {
        
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
        const animeIds= await animeContract.getAnimeIds();

        const totalUpvotesCount= (await animeContract.getAllUpvotesCount()).toNumber();
        setTotalUpvotesCount(totalUpvotesCount);
        //console.log(allUpvotes[9].upvoteCount.toNumber());
        //console.log(animeIds);
        //below one works
        //allUpvotes.map(upvote => {
        //  console.log(upvote.animeId);
        //})
        
        
        if(allTimeToggle === true){
          animeIds.reverse();
          console.log(animeIds);
        }
         
        

        const animeUpvotes = animeIds.map(animeId => {
          const lastOccurrence = allUpvotes.findLast(upvote => upvote.animeId === animeId);
          return {animeId: lastOccurrence.animeId,
                  animeTitle: lastOccurrence.animeTitle,
                  animeImg: lastOccurrence.animeImg,
                  animeUrl: lastOccurrence.animeUrl,
                  upvoteCount: lastOccurrence.upvoteCount.toNumber(),                
                  };
        });
        /*
          The comparator function in this case compares the upvoteCount property of two elements, a and b, and
          returns the difference. A positive value means that b comes first and a negative value means that a comes first.
          So in this case it will sort the array in descending order of upvoteCount. 
          
          #It was needed to look for the case when the upvoteCount is same, but due to the nature of animeIds,
          which has elements added in order of timings of when they were upvoted, so naturally they're added into the 
          animeUpvotes array in that order, & that order correctly gives preference to the anime upvoted earlier.
          */
        if(!allTimeToggle) {
          animeUpvotes.sort((a, b) => b.upvoteCount - a.upvoteCount);
        }
        
        setResults(animeUpvotes); //when search is empty, we gotta show this.

        //console.log(animeUpvotes, animeIds);

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

  //If nothing is searched,
  useEffect(() => {
      if(search === ""){
        updateAllUpvotes();
        setIsBeingSearched(false);
      }
      else setIsBeingSearched(true);
    }, [search])
  

  useEffect(() => {
    updateAllUpvotes();
  }, [allTimeToggle])

  const handleChange = event => {
    setSearch(event.target.value);
    //If search changes, we can't change suggested anime yet, bcz only from the list
    //shown, when the user clicks on suggest, then the txn is confirmed.
    //setAnimeSuggestion(event.target.value);
  };
  
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;

  
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
          <br/>Upvote ⬆️ your favorite anime here, share it<br/> to your frens too, and make your favorites the top rated one!!!
        </div>
        <div>
      </div>
        <div className="animeSearch">
          <p>Didn't find yours in the Top10 below? Search here  👇</p>
        <form action="">
          <input type="text" className="animeSearchInput" 
                placeholder="Search your favorite anime" name="searchInput" 
                value={search} onChange={handleChange} />
        </form>
      </div>

      {isBeingSearched ? 
        <div></div>
        :
        <div className="toggle-container">
        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
          <ToggleButton variant="secondary" className={`toggle-btn ${allTimeToggle ? '' : 'active'}`}
                        onClick={() => setAllTimeToggle(false)} value={1}>
            Top 10
          </ToggleButton>
          <ToggleButton variant="secondary" className={`toggle-btn ${allTimeToggle ? 'active' : ''}`}
                        onClick={() => setAllTimeToggle(true)} value={2}>
            All time
          </ToggleButton>
        </ToggleButtonGroup>        
      </div>
      }
      

    {!allTimeToggle ?
      <Container>
        <Row className="results justify-content-center" >
          
          {
            results.slice(0, 10).map((anime, index) => {
              return(
              <Col key={anime.animeId} className="result">
                <Card className="card" >
                  <Card.Img className="cardImpTop" variant="top" src={anime.animeImg} />
                      <Card.Body className="cardBody">
                        {isBeingSearched ? 
                          <Card.Title className="cardTitle">{anime.animeTitle} </Card.Title>
                          :
                          <>
                          <Card.Title className="cardTitle"><strong>#{index+1}.</strong> {anime.animeTitle} </Card.Title>
                          <p>{ Math.round((anime.upvoteCount / totalUpvotesCount) * 100) }% users upvoted this.</p>
                          </>      
                      }
                        
                    {/* without the ()=> in onClick={() => {}}, it would be run automatically, so it has to be passed as a function. */}
                    <Button className="card-btn" variant="primary" onClick={() => upvoteAnime(anime.animeId, anime.animeTitle, 
                                                                        anime.animeImg, anime.animeUrl)}>Upvote  ⬆️</Button> 
                    <Button className="card-btn" variant="primary" href={anime.animeUrl} target="_blank">Watch  ▶️</Button>                                                    
                  </Card.Body>
                </Card> 
              </Col>
            )
            })
          }
          
          </Row>
      </Container> 
          
          :
          
     
        <Pagination className="pagination">
          <Container>
            <div className="pagination-arrows">
              <ToggleButtonGroup name="pagination-arrows">
                <ToggleButton variant="secondary" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
                  <Pagination.Prev />
                </ToggleButton>
                <ToggleButton variant="secondary" onClick={() => setCurrentPage(currentPage + 1)} 
                                            disabled={currentPage === Math.ceil(results.length / itemsPerPage) - 1}>
                  <Pagination.Next />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

 
          <Row className="results justify-content-center" >
            {results.slice(start, end).map((anime, index) => { 
                return(
                  <Col key={anime.animeId} sm={4} className="result">
                    
                    <Card className="card" >
                      <Card.Img className="cardImpTop" variant="top" src={anime.animeImg} />
                        <Card.Body className="cardBody">
                          {isBeingSearched ? 
                            <Card.Title className="cardTitle">{anime.animeTitle} </Card.Title>
                            :
                            <>
                            <Card.Title className="cardTitle"> {anime.animeTitle} </Card.Title>
                            <p>{ Math.round((anime.upvoteCount / totalUpvotesCount) * 100) }% users upvoted this.</p>
                            </>      
                          }
                          <Button className="card-btn" variant="primary" onClick={() => upvoteAnime(anime.animeId, anime.animeTitle, 
                                                                                      anime.animeImg, anime.animeUrl)}>Upvote  ⬆️</Button> 
                          <Button className="card-btn" variant="primary" href={anime.animeUrl} target="_blank">Watch  ▶️</Button>                                                    
                        </Card.Body>
                    </Card> 
                  
                  </Col>
                  
                )
              })}
          </Row>
          </Container> 
        </Pagination>
       
         
          
        }
            
      
      <Footer />
      </div> 

      
    </div>

  
    </>
     
  );
};

export default App;