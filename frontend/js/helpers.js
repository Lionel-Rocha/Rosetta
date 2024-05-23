
async function default_page_loader(){
    updateGasPrice();
    await handles_news();

    setInterval(updateGasPrice, 4000);
    setInterval(handles_news, 900000);
}


async function fetch_news(){
    return await fetch("https://rosetta-production.up.railway.app/get_news", {
        mode: 'cors'
    })
        .then(news => news.json());
}

let old_news;

async function handles_news(){
    let news = await fetch_news();
    news = news.data;
    if (news !== old_news){
        for (let i = 0; i < 5; i++){
            let news_place = document.getElementById("news_place");
            let news_box = document.createElement("div");
            news_box.className = "news_element"

            let news_title = news[i].title;
            let news_link = news[i].url;

            let milliseconds = news[i].updated_at * 1000;
            let news_date = new Date(milliseconds);
            let hours = news_date.getHours();
            let minutes = news_date.getMinutes();

            let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            let news_header = document.createElement("a");
            news_header.target = "blank";
            news_header.innerText = news_title;
            news_header.href = news_link;

            let news_site = document.createElement("p");
            news_site.innerText = "Available at " + news[i].news_site;

            let news_time = document.createElement("p");
            news_time.innerText = "At " +formattedTime;

            news_box.appendChild(news_header);
            news_box.appendChild(news_site);
            news_box.appendChild(news_time);

            news_place.appendChild(news_box);
            old_news = news;
        }
    }

}

//toggles dark/light mode
function toggle(){
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
}

//fetches gas price
async function updateGasPrice() {
    try {
        let price = await get_gas_price();
        price = parseInt(price, 16);
        price = Math.round(price / 10000000) /100;
        if (window.location.href.includes("profile.html")) {
            document.getElementById("gas_price_2").innerText = price.toString();
        } if (window.location.href.includes("settings.html")){
            document.getElementById("gas_price_3").innerText = price.toString();
        } else {
            document.getElementById("gas_price").innerText = price.toString();
        }



    } catch (error) {
        console.error("Error fetching gas price:", error);
    }
}

async function get_gas_price() {
    return await window.ethereum.request({
        method: "eth_gasPrice",
        params: []
    });
}

//search functions

function appear(){
    document.getElementById("popup_search").style.visibility = "visible";
}


function hide(){
    document.getElementById("popup_search").style.visibility = "hidden";
}

async function search() {
    event.preventDefault();
    let search_address = document.getElementById("search_input").value;

    let result = await gets_user(search_address);
    if (result === ",,"){
        alert("User not found.");
    } else {
        sessionStorage.setItem("another_user", search_address);
        window.location = "other_user_profile.html";
    }

    hide();
}

async function get_stones() {
    return await fetch("https://rosetta-production.up.railway.app/get_stones", {
        mode: 'cors'
    }).then(response => response.json());
}

async function gets_user(address){
    return await fetch(`https://rosetta-production.up.railway.app/get_user?address=${address}`)
        .then(information => information.json());
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

function convertHexToDate(hexTime) {
    let timeInSeconds = parseInt(hexTime, 16);
    let timeInMilliseconds = timeInSeconds * 1000;
    let date = new Date(timeInMilliseconds);
    return date.toLocaleString();
}



