const $hamburgerLinksContainer = document.querySelector('#hamburger-links')
const $hamburgerIcon = document.querySelector('#hamburger-icon');

$hamburgerIcon.addEventListener('click',()=>{
    if($hamburgerLinksContainer.style.display==="none")
        $hamburgerLinksContainer.style.display = "flex";
    else
        $hamburgerLinksContainer.style.display = "none";
})