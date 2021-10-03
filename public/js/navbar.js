const $hamburgerIcon = document.querySelector('#hamburger-icon');
const $links = document.querySelector('#links');
const $User = document.getElementById('user');

const getCookieValue = (name) =>{
    let match = document.cookie.match(RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
    return match ? match[1]:null;
}

//Hamburger navbar logic
$hamburgerIcon.addEventListener('click',()=>{
    if($links.style.display==="none")
        $links.style.display = "flex";
    else
        $links.style.display = "none";
})

//account logic
const username = getCookieValue("Username")
if(username){
    $User.innerHTML = username;
}