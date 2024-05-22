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