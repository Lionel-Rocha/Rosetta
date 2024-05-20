async function user_info() {
    profile_load();
    let user_address = sessionStorage.getItem("account");
    let user = await gets_user(user_address);

    document.getElementById("username").innerText = user[0];
    gets_banner();
    gets_profile_picture(user);


    handles_user_stones(user_address)
    // updateGasPrice();
    // setInterval(updateGasPrice, 4000);



}

function gets_profile_picture(user){
    let picture = user[2]
    let profile_picture = document.createElement("img");
    profile_picture.src = picture;
    profile_picture.className = "profile_picture";

    document.getElementById("profile_picture").appendChild(profile_picture);
    document.getElementById("profile_user").innerText = user[0];

    gets_bio(user);
}

function gets_bio(user){
    let bio = document.createElement("p");
    bio.className = "bio";
    bio.innerText = user[1];
    document.getElementById("bio").appendChild(bio);
}
function gets_banner(){
    let number= Math.floor(Math.random() * 3) + 1;
    let banner = document.createElement("img");
    banner.src = "images/banner" + number.toString() + ".png";
    banner.className = "banner";
    document.getElementById("profile_banner").appendChild(banner);

}
async function gets_user(address){
    return await fetch(`https://rosetta-production.up.railway.app/get_user?address=${address}`)
        .then(information => information.json());
}

async function get_all_user_stones(address){
    return await fetch(`https://rosetta-production.up.railway.app/get_user_stones?address=${address}`)
        .then(information => information.json());
}

async function handles_user_stones(address){
    let response = await get_all_user_stones(address);
    console.log(response);
    await fetch_stones(response);
}
