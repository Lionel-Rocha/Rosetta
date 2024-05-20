let account_connected = false;
let account;
const contract_address = "0xF744073FDE4d0f259624e675620587F69efA924C";
let signer;
let sepolia = "https://sepolia.drpc.org"
let abi = {
    "abi": [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "writer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "username",
                    "type": "string"
                }
            ],
            "name": "change_user_det",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "writer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "text",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "write_stone",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "bio",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "profile_picture",
                    "type": "string"
                }
            ],
            "name": "change_user_details",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                }
            ],
            "name": "get_stone",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "writer",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "username",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "text",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct rosetta.stone",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user_address",
                    "type": "address"
                }
            ],
            "name": "get_user",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "bio",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "profile_picture",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct rosetta.user",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
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
                    "internalType": "string",
                    "name": "text",
                    "type": "string"
                }
            ],
            "name": "write_in_stone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
}

let contract ;
    function convertHexToDate(hexTime) {
    // Step 1: Parse the hexadecimal string to an integer
    let timeInSeconds = parseInt(hexTime, 16);

    // Step 2: Convert the integer to milliseconds (if necessary)
    let timeInMilliseconds = timeInSeconds * 1000;

    // Step 3: Create a new Date object using the milliseconds
    let date = new Date(timeInMilliseconds);

    // Step 4: Format the date as desired
     // Customize the format as needed
    return date.toLocaleString();
}
async function requestAccount() {
    console.log('Requesting account...');

    if (window.ethereum) {
        console.log('detected');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const provider = new ethers.providers.Web3Provider(window.ethereum)

            await provider.send("eth_requestAccounts", []);

            signer = provider.getSigner()
            account = await signer.getAddress();
            document.getElementById("account_address").innerText = account;
            sessionStorage.setItem("account", account);




        } catch (error) {
            console.log('Error connecting...');
            console.log(error);
        }

        } else {
            alert('Meta Mask not detected');
        }
}


function stringToHex(text) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hexBytes = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hexBytes;
}

// Example usage

async function write_in_stone(event) {

    event.preventDefault();
    let text = document.getElementById("user_text").value;

    if (text.length > 260) {
        alert("Text length exceeds 260 characters. Your stone won't be registered!");
        return;
    }

    if (signer === undefined){
        requestAccount();
    }

    try {
        let text_to_hex = stringToHex(text);
        console.log(signer);

        contract = new ethers.Contract(contract_address, abi.abi, signer);
        let result = await contract.write_in_stone(text);

        document.getElementById("user_text").innerText = "";
    } catch (error) {

        console.error("Error while sending transaction:", error);
        alert("An error occurred while sending transaction.");
    }
}

async function get_gas_price() {
    return await window.ethereum.request({
        method: "eth_gasPrice",
        params: []
    });
}

async function updateGasPrice() {
    try {
        let price = await get_gas_price();
        price = parseInt(price, 16);
        price = Math.floor(price / 1000000000);
        document.getElementById("gas_price").innerText = price.toString();
    } catch (error) {
        console.error("Error fetching gas price:", error);
    }
}

function index_load() {
    document.getElementById("user_text").value = "";
    updateGasPrice(); // Initial update on page load
    handles_stones();
    document.getElementById("account_address").innerText = sessionStorage.getItem("account");
    // Set interval to update gas price every 4 seconds
    setInterval(updateGasPrice, 4000);


    setInterval(handles_stones, 10000);

}

function profile_load(){


    updateGasPrice();
    document.getElementById("account_address").innerText = sessionStorage.getItem("account");
    setInterval(updateGasPrice, 4000);
}

async function handles_stones(){
        let response = await get_stones();
        fetch_stones(response)
}



    async function get_stones() {
        return await fetch("https://rosetta-production.up.railway.app/get_stones", {
            mode: 'cors'
        }).then(response => response.json());
    }


let last_response_tip = 0;

async function fetch_stones(response){


    let response_tip = response.length;

    let feed_body = document.getElementById("feed_body");
    try{
        for (let i = response_tip - 1; i >= last_response_tip; i--) {
            // Create new elements for each iteration
            let stone = document.createElement('div');
            let stone_writer_info = document.createElement('div');
            stone.className = "stone";
            stone_writer_info.className = "stone_writer_info";

            let writer = document.createElement('p');
            let writing = document.createElement('p');
            let user_writer = document.createElement("h4");
            let stone_time = document.createElement("p");
            stone_time.className ="time";
            let time = response[i][4].hex;
            time = convertHexToDate(time);


            writer.innerText = response[i][0];
            writing.innerText = response[i][3];
            stone_time.innerText = "Stone written at " +time;
            if (response[i][1] === "") {
                user_writer.innerText = await get_anonymous_username();
            } else {
                user_writer.innerText = "@" + response[i][1];
            }

            // Append the writer and user_writer elements to the stone_writer_info element
            stone_writer_info.appendChild(user_writer);
            stone_writer_info.appendChild(writer);
            // Append stone_writer_info and writing to the stone element
            stone.appendChild(stone_writer_info);
            stone.appendChild(writing);
            stone.appendChild(stone_time);

            // Append the stone element to the feed_body element
            feed_body.appendChild(stone);
        }
        last_response_tip = response.length;
    } catch (e){
        console.log(e);
    }



}


async function get_anonymous_username(){
    let result = await fetch("https://random-word-api.herokuapp.com/word?number=2")
        .then(response => response.json());

    return result[0] + " " + result[1];
}




