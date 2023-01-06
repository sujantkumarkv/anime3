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
    struct animeUpvoteStruct {
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
        /*
        if(upvotedAnimeMapping.exists(_animeId)){ //to check if anime has already been upvoted; return bool
            upvotedAnimeMapping[_animeId] += 1; 
        }
        */

        animeUpvoteMapping[_animeId]= 1;
        animeUpvoteArray.push(animeUpvoteStruct(_animeId, animeUpvoteMapping[_animeId], msg.sender, block.timestamp));

        /* last time on 4jan, i'm here thinking of using only one struct, one mapping, animeUpvotes does the job Ig,
        so put all in one, sort it & pick top10 works. that way I have all sorted too. next time continue on that.*/


         /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);
        /*
        
         */
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

        //This will make it easy to retrieve the waves from our website
        emit newUpvote(_animeId, animeUpvoteMapping[_animeId], msg.sender, block.timestamp);
    }

    /* 

    function sortTop10() public view returns (top10UpvotedStruct[]) {
        // Iterate through the mapping and add each key and value to the array
        uint256 i = 0;
        for (string key in top10UpvotedAnime) {
            top10UpvotedAnimes.push(top10UpvotedStruct({key: key, value: top10UpvotedAnimes[key]}));
            i++;
        }
        // Sort the kvs array in descending order of values using the sort function
        function compare(KV storage a, KV storage b) public pure returns (bool) {
            return a.value > b.value;
        }
        kvs.sort(compare);
        // Return the sorted kvs array
        return kvs;
    }

    function sortTop10() public view returns (KV[]) {
        // Get an array of all the keys in the top10UpvotedAnimes mapping
        bytes32[] memory keys = top10UpvotedAnimes.keys();
        // Iterate through the keys array and add each key and corresponding value to the kvs array
        for (uint256 i = 0; i < keys.length; i++) {
            kvs.push(KV({key: keys[i], value: top10UpvotedAnimes[keys[i]]}));
        }
        // Sort the kvs array in descending order of values using the sort function
        function compare(KV storage a, KV storage b) public pure returns (bool) {
            return a.value > b.value;
        }
        kvs.sort(compare);
        // Return the sorted kvs array
        return kvs;
    }

    */

    


/* 
 function getAllUpvotes() public view returns (animeUpvote[] memory) {
        return animeUpvotes;
    }

*/
   
    function getAllUpvotesCount() public view returns (uint256) {
        return allUpvotesCount;
    }

    function showAllAnimeUpvotes() public view returns (animeUpvoteStruct[] memory) {
        return animeUpvoteArray;
    }

}
