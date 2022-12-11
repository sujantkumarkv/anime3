// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "../node_modules/hardhat/console.sol";

contract AnimeList {
    uint256 private seed;
    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
        seed = (block.timestamp + block.difficulty) % 100;
    }
    uint256 animeList;
    mapping(address => uint256) public suggestionCounter; //to count who suggests the most animes(super anime watcher)
    mapping(address => uint256) public lastSuggested;

    event newSuggestion(address indexed from, uint256 timestamp, string message);

    struct animeSuggest{
        address suggestor; // The address of the user who waved.
        uint256 timestamp; // The timestamp when the user waved.
        string message; // The message the user sent.
    }

    animeSuggest[] animeSuggestions;

    function suggestAnime(string memory _message) public{
        require(lastSuggested[msg.sender] + 11 seconds < block.timestamp, "Wait for 11 seconds please");
        lastSuggested[msg.sender]= block.timestamp;

        animeList += 1;
        suggestionCounter[msg.sender] += 1;
        animeSuggestions.push(animeSuggest(msg.sender, block.timestamp, _message));
        
        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit newSuggestion(msg.sender, block.timestamp, _message);

         /*
         * Generate a new seed for the next user that sends a wave
         */
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
        console.log("%s has sent a suggestion", msg.sender);

        //This will make it easy to retrieve the waves from our website
        emit newSuggestion(msg.sender, block.timestamp, _message);
    }
    function getAllSuggestions() public view returns (animeSuggest[] memory) {
        return animeSuggestions;
    }

    function getTotalAnimes() public view returns (uint256) {
        return animeList;
    }

}
