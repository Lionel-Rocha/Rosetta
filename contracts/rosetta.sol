// SPDX-License-Identifier: GNU
pragma solidity ^0.8.25;

contract rosetta {
    address public owner;
    uint256 private counter;

    constructor(){
        owner = msg.sender;
        counter = 0;
    }

    struct stone {
        address writer;
        uint256 id;
        string text;
        uint256 timestamp;
    }

    struct user {
        string name;
        string bio;
        string profile_picture;
    }

    mapping(uint256 => stone) Stones;
    mapping(address => user) Users;

    event write_stone(address writer, uint256 id, string text, uint256 timestamp);

    function write_in_stone(string memory text) public {
        stone storage newStone = Stones[counter];
        newStone.text = text;
        newStone.writer = msg.sender;
        newStone.id = counter;
        newStone.timestamp = block.timestamp;
        emit write_stone(msg.sender, counter, text, block.timestamp);
        counter++;
    }

    function get_stone(uint256 id) public view returns (stone[] memory){
        stone[] memory result = new stone[](id);
        return result;
    }
} 
