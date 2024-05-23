function profile_load(){
    default_page_loader();
    // document.getElementById("account_address").innerText = sessionStorage.getItem("account");
}

async function user_info() {
    await profile_load();
    let user_address = sessionStorage.getItem("account");

    if (user_address){
        let user = await gets_user(user_address);
        document.getElementById("username").innerText = user[0];
        gets_banner();
        gets_profile_picture(user);
        gets_bio(user);
        handles_user_stones(user_address)
    } else {
        let alert = document.createElement("h2");
        alert.innerText = "User not connected";
        document.getElementById("profile_header").append(alert);

        let warning = document.createElement("div");
        warning.className = "stone";
        warning.innerText = "To display your user information, please connect to MetaMask.";

        document.getElementById("bio").append(warning);
    }




}

async function another_user(){
    profile_load();
    let another_user_address = sessionStorage.getItem("another_user");
    let another_user_info = await gets_user(another_user_address);
    document.getElementById("username").innerText = another_user_info[0];
    gets_banner();
    gets_profile_picture(another_user_info);
    gets_bio(another_user_info);

    handles_user_stones(another_user_address);


}

function gets_profile_picture(user){

    let picture = user[2]
    let profile_picture = document.createElement("img");
    profile_picture.src = picture;
    profile_picture.className = "profile_picture";

    document.getElementById("profile_picture").appendChild(profile_picture);
    document.getElementById("profile_user").innerText = user[0];


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


async function get_all_user_stones(address){
    return await fetch(`https://rosetta-production.up.railway.app/get_user_stones?address=${address}`)
        .then(information => information.json());
}

async function handles_user_stones(address){
    let response = await get_all_user_stones(address);
    console.log(response);
    await fetch_stones(response);
}
