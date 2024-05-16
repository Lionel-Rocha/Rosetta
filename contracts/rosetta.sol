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
        string username;
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
    event change_user_det(address writer, string username);

    function change_user_details(string memory name, string memory bio, string memory profile_picture) public {
        user storage user_data = Users[msg.sender];
        user_data.name = name;
        user_data.bio = bio;
        user_data.profile_picture = profile_picture;

        emit change_user_det(msg.sender, name);
    }

    function write_in_stone(string memory text) public {
        stone storage newStone = Stones[counter];
        newStone.text = text;
        newStone.writer = msg.sender;
        newStone.username = Users[msg.sender].name;
        newStone.id = counter;
        newStone.timestamp = block.timestamp;
        emit write_stone(msg.sender, counter, text, block.timestamp);
        counter++;
    }

    function get_stone(uint256 id) public view returns (stone memory) {
        return Stones[id];
    }

    function get_user(address user_address) public view returns (user memory){
        return Users[user_address];
    }



} 
