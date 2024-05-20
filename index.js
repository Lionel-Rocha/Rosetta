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
const contract_address = "0xF744073FDE4d0f259624e675620587F69efA924C";
let contract = new ethers.Contract(contract_address, contract_abi, provider);


async function get_user_stones(address){
    let counter = 0;
    let array = [];
    let result;
    let writer_zero = "0x0000000000000000000000000000000000000000";
    try {
        result = await contract.get_stone(counter);
        while (result.writer !== writer_zero){
            if (result.writer === address) {
                array.push(result);
                counter += 1;
            } else {
                counter +=1;
            }
            result = await contract.get_stone(counter);
        }
    
        
        
    } catch (error) {
        console.error("Error fetching stone:", error);
    }
    return array;
}

async function get_user(address) {
    try{
      let result = await contract.get_user(address);
        return result;  
    } catch (e){
        return e;
    }
    
}

async function get_user_stones(address){
    let counter = 0;
    let result;
    let array = [];
     try {
        result = await contract.get_stone(counter);
        if (result.writer === address) {
            array.push(result);
            counter += 1;
        } else {
            counter +=1;
            }
        } catch (error) {
            console.error("Error fetching stone:", error);
            result = false;
        }
    return array;
    }



http.createServer(async function (req, res) {
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        
        if (pathname === '/get_stones' && method === 'GET') {
            let result = await get_stones();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        
        } else if (pathname === '/get_user' && method === 'GET' && parsedUrl.searchParams.has('address')) {
            let user_address = parsedUrl.searchParams.get('address');
            let result = await get_user(user_address);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else if (pathname === '/get_user_stones' && method === 'GET' && parsedUrl.searchParams.has('address')){
            let user_address = parsedUrl.searchParams.get('address');
            let result = await get_user_stones(user_address);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } 
        else {
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
