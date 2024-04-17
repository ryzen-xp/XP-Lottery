// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
contract Lottery{
    address public  manger;
    address[] public  players;
   constructor() {
        manger = msg.sender;
    }
    function enter()public payable {
        require(msg.value >= 2 ether);
        players.push(msg.sender);
    }
    function WinnerPlayer()public payable {
        require(msg.sender == manger);
        uint index= random() % players.length;
        address winner = players[index];
         players = new address[](0); // Reset the players array
        payable(winner).transfer(address(this).balance);


    }
        function getPlayers() public view returns (address[] memory) {
        return players;
    }
    function random()private view  returns(uint){
       return uint(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp, players)));
    }
    modifier restricted() {
        require(msg.sender == manger);
        _;
    }
    //prevrandao

}