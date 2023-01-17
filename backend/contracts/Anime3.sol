// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../node_modules/hardhat/console.sol";

contract Anime3 {
    uint256 private seed;
    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
        seed = (block.timestamp + block.difficulty) % 100;
        
    }
    uint256 allUpvotesCount;
    //mapping(address => uint256) public upvoteCounter; //to count who upvotes the most animes(super anime watchoor)
    mapping(address => uint256) public lastUpvoted;

    mapping(string => uint256) public animeUpvoteMapping;
    string[] animeIds;
    struct animeUpvoteStruct { //this is for pushing txn history to chain.
        string animeId;
        string animeTitle;
        string animeImg;
        string animeUrl;
        uint256 upvoteCount;

        address upvoter; // The address of the user who upvoted.
        uint256 timestamp; // The timestamp when the user upvoted.
    }
    animeUpvoteStruct[] animeUpvoteArray; //array containing upvoted animes.

    event newUpvote(string animeId, string animeTitle, string animeImg, string animeUrl,
                    uint256 upvoteCount, address indexed from, uint256 timestamp);

    function upvoteAnime(string memory _animeId, string memory _animeTitle, string memory _animeImg, string memory _animeUrl) public{
        //require(lastUpvoted[msg.sender] + 11 seconds < block.timestamp, "Wait for 11 seconds please");
        //lastUpvoted[msg.sender]= block.timestamp;

        allUpvotesCount += 1;
       
        //to check if anime has already been upvoted
        //IMPORTANT
        /* looping through array or comparing direct values was giving errors like

            #memory _animeId and storage animeId of struct cant be compared with '=='
            #abi.encodePacked & converting to bytes then bytes.compare was suggested by chatGPT but all threw errors.
            #IMP: There's no such thing in mapping 'if a key exists or not, all keys exists with default null, 0 etc';
                    so we can check if val>0 or if length in bytes>0, that proves that some value exists. 
        */
        if(animeUpvoteMapping[_animeId] > 0){
            animeUpvoteMapping[_animeId] += 1;
        }
        else{
            animeUpvoteMapping[_animeId]= 1;
            animeIds.push(_animeId);
        }
        animeUpvoteArray.push(animeUpvoteStruct(_animeId, _animeTitle, _animeImg, _animeUrl,
                                                animeUpvoteMapping[_animeId], msg.sender, block.timestamp));

         /*
         * Generate a new seed for the next user that sends a wave
        
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);
  
        
         
        if(seed >50){
            console.log("Eligible for a prize of 0.0001 ETH...");
            uint256 prizeAmt= 0.0001 ether;
            require(prizeAmt < address(this).balance, "cant' withdraw more than the balance");
            console.log("Balance is sufficient for prize amount");
            (bool txnResult, )= msg.sender.call{value: prizeAmt}("");
            require(txnResult, "txn failed for some reasons...");
            console.log("Prize sent successfully");
        }
        console.log("%s has upvoted a new anime", msg.sender);
         */
        //This will make it easy to retrieve the waves from our website
        emit newUpvote(_animeId, _animeTitle, _animeImg, _animeUrl,
                        animeUpvoteMapping[_animeId], msg.sender, block.timestamp);
    }

   
    function getAllUpvotesCount() public view returns (uint256) {
        return allUpvotesCount;
    }

    function getAnimeIds() public view returns (string[] memory){
        return animeIds;
    }


    function getAllUpvotes() public view returns (animeUpvoteStruct[] memory) {
        return animeUpvoteArray;
    }

    
    
}
