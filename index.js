const port = process.env.PORT || 3000;
const {parse} = require("querystring");
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

http.createServer(async function (req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        if (pathname === '/get_stones' && method === 'GET') {
            let result = await get_stones();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        
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
