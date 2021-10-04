const $navbar = document.querySelector('#navbar');
const $hamburgerIcon = document.querySelector('#hamburger-icon');
const $links = document.querySelector('#links');
const $userLink = document.querySelector('#user');
const $userModal = document.querySelector('#user-modal');
const $modalFormButtons = document.querySelectorAll('.modal-button');
const $modalCloseButton = document.querySelector('.close');
const $loginForm = document.querySelector("#login-form");
const $registerForm = document.querySelector("#register-form");
const $loginSubmitButton = document.querySelector('#login-submit');
const $registerSubmitButton = document.querySelector('#register-submit');


const getCookieValue = (name) =>{
    let match = document.cookie.match(RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
    return match ? match[1]:null;
}

const setNavbarVisibility = () => {
    if(window.innerWidth<1000){
        $links.classList.add("hidden");
        $links.style['flex-direction'] = 'column';
        $hamburgerIcon.classList.remove("hidden");
        $navbar.style['grid-template-areas'] = '"logo icon" "links links"';
    }
    else{
        $links.classList.remove("hidden");
        $links.style['flex-direction'] = 'row';
        $hamburgerIcon.classList.add("hidden");
        $navbar.style['grid-template-areas'] = '"logo links"';
    }
}

//Hamburger navbar logic
$hamburgerIcon.addEventListener('click',()=>{
    if($links.classList.contains('hidden'))
        $links.classList.remove('hidden');
    else
        $links.classList.add('hidden');
})

//account logic
const username = getCookieValue("username")
if(username){
    $userLink.innerHTML = username;
}

//User modal logic
$userLink.addEventListener('click',(e)=>{
    e.preventDefault();
    if($userLink.innerHTML === 'Account'){
        $userModal.style.display = "flex";
    }
})
$userModal.addEventListener('click',(e)=>{
    if(e.target === $modalFormButtons[0]){
        $modalFormButtons[0].classList.add('selected');
        $loginForm.classList.remove('hidden');
        $modalFormButtons[1].classList.remove('selected');
        $registerForm.classList.add('hidden');
    }
    if(e.target === $modalFormButtons[1]){
        $modalFormButtons[1].classList.add('selected');
        $registerForm.classList.remove('hidden');
        $modalFormButtons[0].classList.remove('selected');
        $loginForm.classList.add('hidden');
    }  
    if(e.target === $userModal)
        $userModal.style.display = "none";
    if(e.target === $modalCloseButton)
        $userModal.style.display = "none";
})

$loginSubmitButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    $loginSubmitButton.disabled = true;
    const $loginEmail = document.querySelector('#login-email');
    const $loginPassword = document.querySelector('#login-password');
    try{
        axios.post('/user/login',{
            email: $loginEmail.value,
            password: $loginPassword.value,
        })
        .then(response=>{location.reload})
        .catch(err=>{
            console.log(err.response.data)
        })
    }
    catch(err){
        console.log(err)
    }
    setTimeout(()=>{
        $loginSubmitButton.disabled = false;
    },2000)
})

$registerSubmitButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    const $firstName = document.querySelector('#register-first-name');
    const $lastName = document.querySelector('#register-last-name');
    const $email = document.querySelector('#register-email');
    const $password = document.querySelector('#register-password');
    const $dateOfBirth = document.querySelector('#register-dob');
    try{
        axios.post('/user/new',{
            firstName: $firstName.value,
            lastName: $lastName.value,
            email: $email.value,
            password: $password.value,
            dateOfBirth: $dateOfBirth.value
        })
        .then(response=>{console.log(response)})
        .catch(err=>{
            console.log(err.response.data)
        })
    }
    catch(err){
        console.log(err);
    }
})


window.onresize = () => setNavbarVisibility();
setNavbarVisibility();