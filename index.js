const {parse} = require("querystring");
const port = process.env.PORT || 3000;
const path = require('path');
const ethers = require("ethers");
const http = require('http');
const contract_json = require(path.join(__dirname,'rosetta.json'));
const detectEthereumProvider = require("@metamask/detect-provider");
const contract_abi = contract_json.abi;
const sepolia_url = "https://sepolia.drpc.org"
const provider = new ethers.providers.JsonRpcProvider(sepolia_url);
let contract = new ethers.Contract("0xF744073FDE4d0f259624e675620587F69efA924C", contract_abi, provider);


async function get_stones() {
    let counter = 0;
    let result = true;
    let array = [];
    while (result) {
        try {
            result = await contract.get_stone(counter);
            if (result.writer === "0x0000000000000000000000000000000000000000") {
                result = false;
            } else {
                array.push(result); // Use array.push() instead of array.append()
                counter += 1;
            }
        } catch (error) {
            console.error("Error fetching stone:", error);
            result = false;
        }
    }
    return array;
}

async function get_user(address){
    let result = contract.get_user(address);

    if (!result[0]){
        return false;
    } else {
        return result;
    }
}
let ethersProvider, signer;
async function write_stone(text) {
    return await contract.write_in_stone(text);
    // ethersProvider = new ethers.providers.Web3Provider(wallet.provider, sepolia_url)
    // signer = ethersProvider.getSigner()
    // contract = ethers.Contract("0xF744073FDE4d0f259624e675620587F69efA924C", contract_abi, ethersProvider);
    // return await contract.write_in_stone(text);
}

async function change_user_info(wallet, name, bio, profile_picture){
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, sepolia_url)
    signer = ethersProvider.getSigner()
    contract = ethers.Contract("0xF744073FDE4d0f259624e675620587F69efA924C", contract_abi, ethersProvider);

    const updates = {};

    if (name && name.trim()) {
        updates.name = name.trim();
    }

    if (bio && bio.trim()) {
        updates.bio = bio.trim();
    }

    if (profile_picture && profile_picture.trim()) {
        updates.profile_picture = profile_picture.trim();
    }

    if (Object.keys(updates).length === 0) {
        throw new Error("No valid input provided to update.");
    }
    console.log(updates.name, updates.bio, updates.profile_picture);
    try {
         // This function should be defined to handle the actual update logic
        return await contract.change_user_details(updates.name, updates.bio, updates.profile_picture);
    } catch (error) {
        console.error("Error updating user information:", error);
        throw new Error("Failed to update user information.");
    }
}

// Create a server object:
http.createServer(async function (req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        if (pathname === '/get_stones' && method === 'GET') {
            let result = await get_stones();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else if (pathname === '/write_stone' && method === 'POST' && parsedUrl.searchParams.has('wallet')) {
            let user_wallet = parsedUrl.searchParams.get('wallet');
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                const parsedBody = querystring.parse(body);
                const text = parsedBody.text;

                try {
                    let result = await write_stone(user_wallet, text);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    console.error("Error writing stone:", error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end("Internal Server Error");
                }
            });
        } else if (pathname === '/get_user' && method === 'GET' && parsedUrl.searchParams.has('address')) {
            let user_address = parsedUrl.searchParams.get('address');
            let result = await get_user(user_address);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("404 Not Found");
        }
    } catch (error) {
        console.error("Error handling request:", error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Internal Server Error");
        }
    }
}).listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
