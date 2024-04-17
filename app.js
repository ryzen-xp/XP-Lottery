const Web3 = require('web3');
// const web3 = new ethers.providers.Web3Provider(window.ethereum);
 const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your Ganache RPC Server URL
const contractABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [],
  "name": "manger",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "players",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
},
{
  "inputs": [],
  "name": "enter",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
  "payable": true
},
{
  "inputs": [],
  "name": "WinnerPlayer",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function",
  "payable": true
},
{
  "inputs": [],
  "name": "getPlayers",
  "outputs": [
    {
      "internalType": "address[]",
      "name": "",
      "type": "address[]"
    }
  ],
  "stateMutability": "view",
  "type": "function",
  "constant": true
}
  // Add the ABI (Application Binary Interface) of your Solidity contract here
];
const contractAddress = '0x13aDd1A3B04bD6Be01581686fd9b98F859fA2caf'; // Replace with your deployed contract address
const lotteryContract = new web3.eth.Contract(contractABI, contractAddress);

async function updateUI() {
  const accounts = await web3.eth.getAccounts();
  const manager = await lotteryContract.methods.manager().call();
  const players = await lotteryContract.methods.getPlayers().call();
  const lotteryState = await lotteryContract.methods.getLotteryState().call();
  const balance = await web3.eth.getBalance(contractAddress);

  document.getElementById('lottery-state').innerText = `Lottery State: ${lotteryState}`;
  document.getElementById('balance').innerText = `Contract Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`;
  document.getElementById('players').innerText = `Players: ${players.join(', ')}`;

  if (accounts[0] === manager) {
    document.getElementById('enter-lottery').disabled = false;
    document.getElementById('pick-winner').disabled = false;
  } else {
    document.getElementById('enter-lottery').disabled = true;
    document.getElementById('pick-winner').disabled = true;
  }
}

document.getElementById('enter-lottery').addEventListener('click', async () => {
  const accounts = await web3.eth.getAccounts();
  await lotteryContract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });
  updateUI();
});

document.getElementById('pick-winner').addEventListener('click', async () => {
  const accounts = await web3.eth.getAccounts();
  await lotteryContract.methods.WinnerPlayer().send({ from: accounts[0] });
  updateUI();
});

document.getElementById('get-players').addEventListener('click', async () => {
  updateUI();
});

updateUI();