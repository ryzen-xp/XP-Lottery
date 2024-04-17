
const contractAddress = '0xD4bC0f108002a1833C8CF65209C04626564C8eb4';
// const contractAddress = 'CONTRACT_ADDRESS'; // Replace with your contract address
const contractABI = 
[
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "set_Price",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "WinnerPlayer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
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
		"type": "function"
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
		"type": "function"
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
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Price",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "total_price",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let manager;


async function connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            document.getElementById("Connected").innerHTML = "Connected account " + accounts[0];
						 await fetchManager();
						if(manager !== accounts[0]){
							var button = document.getElementById("man");
							var button1 = document.getElementById("man1");
							var button2 = document.getElementById("enterAmount");
							button.style.display = "none";
							button1.style.display = "none";
							button2.style.display = "none";
							
						}
            var button = document.getElementById("off");
            button.style.display = "none";
            return true;
        } catch (error) {
            console.error('Failed to connect to Metamask:', error.message);
            return false;
        }
    } else {
        console.error('Metamask is not installed');
        return false;
    }
}


async function loadContract() {
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    return contract;
}


async function enterLottery() {
    const contract = await loadContract();
    const price = await contract.methods.Price().call();
		const accounts = await web3.eth.getAccounts(); 
    await contract.methods.enter().send({ from: accounts[0] , value: price });
		window.log("Thank You for Particiption !!!")
}


async function pickWinner() {
    const contract = await loadContract();
		const accounts = await web3.eth.getAccounts(); 
    await contract.methods.WinnerPlayer().send({from:accounts[0] });
}

async function set_Price() {
	const price = document.getElementById('enterAmount').value;
	await setPrice(price); 
}

async function setPrice(price) {
	const contract = await loadContract();
	const accounts = await web3.eth.getAccounts(); 
	await contract.methods.set_Price(web3.utils.toWei(price.toString(), 'ether')).send({ from: accounts[0] });
}


async function fetchManager() {
    const contract = await loadContract();
     manager = await contract.methods.manger().call();
    document.getElementById('managerAddress').innerHTML = manager;
	
}

 async function fetchprice(){
	const contract = await loadContract();
	const price = await contract.methods.Price().call();
	document.getElementById('price').innerHTML = web3.utils.fromWei(price ,'ether');
 }


async function fetchPlayers() {
    const contract = await loadContract();
    const players = await contract.methods.getPlayers().call();
    const playersList = document.getElementById('players');
    playersList.innerHTML = '';
    players.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = player;
        playersList.appendChild(listItem);
    });
}
async function fetchtotal(){
	const contract = await loadContract();
	const total_price = await contract.methods.total_price().call();
	document.getElementById('total_price').innerHTML =  web3.utils.fromWei(total_price ,'ether');
}

async function main() {
    const isConnected = await connect();
    if (isConnected) {
         fetchManager();
				 fetchprice();
         fetchPlayers();
				 fetchtotal();

    }
}

main();
