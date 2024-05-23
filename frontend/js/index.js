function index_load() {
    handles_stones();
    default_page_loader();
    document.getElementById("user_text").value = "";
    let account = sessionStorage.getItem("account");
    if (account){
        document.getElementById("account_address").innerText = account;
    }

    setInterval(handles_stones, 10000);

}


async function handles_stones(){
    let response = await get_stones();
    await fetch_stones(response)
}






async function get_anonymous_username(){
    let result = await fetch("https://random-word-api.herokuapp.com/word?number=2")
        .then(response => response.json());

    return result[0] + " " + result[1];
}


//Char counter for stones
document.addEventListener('DOMContentLoaded', function() {
    var textarea = document.getElementById('user_text');
    var current = document.getElementById('current');
    var maximum = document.getElementById('maximum');

    textarea.addEventListener('input', function() {
        current.textContent = textarea.value.length;
        maximum.textContent = '/ ' + textarea.maxLength;
    });
});