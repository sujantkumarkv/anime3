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
    mapping(address => uint256) public upvoteCounter; //to count who upvotes the most animes(super anime watcher)
    mapping(address => uint256) public lastUpvoted;

    mapping(string => uint256) public animeUpvoteMapping;
    struct eachAnimeUpvoteStruct { //this  is for converting the mapping to array, data for app.
        string eachAnimeId;
        uint256 eachUpvoteCount;
    }
    string[] public animeIds;
    eachAnimeUpvoteStruct[] eachAnimeUpvoteArray;

    struct animeUpvoteStruct { //this is for pushing txn history to chain.
        string animeId;
        uint256 upvoteCount;
        address upvoter; // The address of the user who upvoted.
        uint256 timestamp; // The timestamp when the user upvoted.
    }
    animeUpvoteStruct[] animeUpvoteArray; //array containing upvoted animes.


    event newUpvote(string animeId, uint256 upvoteCount, address indexed from, uint256 timestamp);

    function upvoteAnime(string memory _animeId) public{
        //require(lastUpvoted[msg.sender] + 11 seconds < block.timestamp, "Wait for 11 seconds please");
        //lastUpvoted[msg.sender]= block.timestamp;

        allUpvotesCount += 1;
        
        //upvoteCounter[msg.sender] += 1;
       
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
        animeUpvoteArray.push(animeUpvoteStruct(_animeId, animeUpvoteMapping[_animeId], msg.sender, block.timestamp));

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
        emit newUpvote(_animeId, animeUpvoteMapping[_animeId], msg.sender, block.timestamp);
    }

        
    function getAnimeIds() public view returns (string[] memory) {
        return animeIds;
    }
   
    function getAllUpvotesCount() public view returns (uint256) {
        return allUpvotesCount;
    }

    function getAllUpvotedAnime() public view returns (animeUpvoteStruct[] memory) {
        return animeUpvoteArray;
    }

    function getAllSortedUpvotedAnime() public returns (string[] memory) {
        
        //firstly need the array with animeId & corresponding total upvoteCount.
        /* 
        for (uint256 i = 0; i < animeIds.length; i++) {
            eachAnimeUpvoteArray.push(eachAnimeUpvoteStruct(animeIds[i],
                                                        animeUpvoteMapping[animeIds[i]]));
        }
        
        for (uint256 i = 0; i < eachAnimeUpvoteArray.length; i++) {
            for (uint256 j = i + 1; j < eachAnimeUpvoteArray.length; j++) {
                if (eachAnimeUpvoteArray[i].eachUpvoteCount < eachAnimeUpvoteArray[j].eachUpvoteCount) {
                    // Swap
                    eachAnimeUpvoteStruct memory temp = eachAnimeUpvoteArray[i];
                    eachAnimeUpvoteArray[i] = eachAnimeUpvoteArray[j];
                    eachAnimeUpvoteArray[j] = temp;
                }
            }
        }
        */
        // Sort the array in descending order using the bubble sort
        
   
        return animeIds;
    }

    /*
        function getTop10SortedUpvotedAnime() public returns (eachAnimeUpvoteStruct[5] memory) {
        eachAnimeUpvoteStruct[5] memory top10AnimeUpvoteArray;
        eachAnimeUpvoteStruct[] memory allAnimeUpvoteArray= getAllSortedUpvotedAnime();
        //The copy function can only be used to copy elements of arrays of primitive types such as uint, bytes, or bool.
        //copy(animeUpvoteArray, top10AnimeUpvoteArray, 10);
        for (uint256 i = 0; i < 5; i++) {
            top10AnimeUpvoteArray[i]= allAnimeUpvoteArray[i];
        }
        return top10AnimeUpvoteArray;
    }

     */
    
}
