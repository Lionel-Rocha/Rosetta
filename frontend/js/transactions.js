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

async function requestAccount() {
    console.log('Requesting account...');

    if (window.ethereum) {
        console.log('detected');
        if (sessionStorage.getItem("account")) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            document.getElementById("account_address").innerText = account;
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);

                await provider.send("eth_requestAccounts", []);

                signer = provider.getSigner()
                account = await signer.getAddress();
                document.getElementById("account_address").innerText = account;
                sessionStorage.setItem("account", account);
                account_connected = true;
                window.location.reload();
            } catch (error) {
                console.log('Error connecting...');
                console.log(error);
            }
        }

    }else{
        alert("Metamask not detected")
    }

}
async function write_in_stone() {

    event.preventDefault();
    let text = document.getElementById("user_text").value;

    if (text.length > 260) {
        alert("Text length exceeds 260 characters. Your stone won't be registered!");
        return;
    }

    if (signer === undefined){
        await requestAccount();
    }

    try {

        contract = new ethers.Contract(contract_address, abi.abi, signer);
        let result = await contract.write_in_stone(text);
        console.log(result);
        document.getElementById("user_text").innerText = "";

    } catch (error) {

        console.error("Error while sending transaction:", error);
        alert("An error occurred while sending transaction.");
    }
}

async function change_user_info() {
    event.preventDefault();

    let account = sessionStorage.getItem("account");
    if (signer === undefined){
        await requestAccount();
    }

    try {
        let name = document.getElementById("user_username").value.trim();
        let profile_picture = document.getElementById("user_profile_picture").value.trim();
        let bio = document.getElementById("user_bio").value.trim();

        if (!name && !profile_picture && !bio) {
            alert("No new information provided to update.");
            return;
        }

        if (profile_picture && !isValidURL(profile_picture)) {
            alert("Please enter a valid URL for the profile picture.");
            return;
        }
        let current_user = await gets_user(account);
        let current_name = current_user[0];
        let current_bio = current_user[1];
        let current_picture = current_user[2];

        let new_name = name || current_name;
        let new_profile_picture = profile_picture || current_picture;
        let new_bio = bio || current_bio;


        contract = new ethers.Contract(contract_address, abi.abi, signer);

        if (new_name === current_name && new_profile_picture === current_picture && new_bio === current_bio) {
            alert("No new information provided to update.");
            return;
        }

        // Validate profile picture URL if provided
        if (new_profile_picture && !isValidURL(new_profile_picture)) {
            alert("Please enter a valid URL for the profile picture.");
            return;
        }

        // Update user information
        let result = await contract.change_user_details(new_name, new_bio, new_profile_picture);
        console.log("Transaction result:", result);
        alert("User information updated successfully!");
        window.location = "profile.html";
    } catch (error) {
        console.error("Error while sending transaction:", error);
        alert("An error occurred while sending transaction.");
    }
}

function isValidURL(string) {
    let res = string.match(/(https?:\/\/[^\s]+)/g);
    return (res !== null);
}
