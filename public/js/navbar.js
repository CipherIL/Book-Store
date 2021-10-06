const $navbar = document.querySelector('#navbar');
const $hamburgerIcon = document.querySelector('#hamburger-icon');
const $userModal1 = document.getElementById('user-modal-1');
const $userModal2 = document.getElementById('user-modal-2');
//Forms
const $loginForm = document.querySelector("#login-form");
const $registerForm = document.querySelector("#register-form");
//Buttons
const $loginSubmitButton = document.querySelector('#login-submit');
const $registerSubmitButton = document.querySelector('#register-submit');
const $modalCloseButton = document.querySelectorAll('.close');
const $modalFormButtons = document.querySelectorAll('.modal-button');
const $editUserButton = document.querySelector('#edit-submit');
//Links
const $links = document.querySelector('#links');
const $browseLink = document.getElementById('link-browse');
const $searchLink = document.getElementById('link-search');
const $userLink = document.getElementById('link-user');
const $cartLink = document.getElementById('link-cart');

//Util funcs
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

const getCart = async () =>{
    let cart;
    const userToken = getCookieValue('userToken');
    if(userToken){ //logged in as a user
        cart = await axios.get('/user/cart');
        cart = cart.data;
        cart = JSON.stringify(cart)
    }
    else{ //anonymous cart
        cart = localStorage.getItem('cart');
    }
    return cart;
}

//Hamburger navbar logic
$hamburgerIcon.addEventListener('click',()=>{
    if($links.classList.contains('hidden'))
        $links.classList.remove('hidden');
    else
        $links.classList.add('hidden');
})

//Links logic
$browseLink.addEventListener('click',()=>{
    location.href = '/';
})
$searchLink.addEventListener('click',()=>{
    location.href = '/b/search';
})
$cartLink.addEventListener('click', async (e)=>{
    e.preventDefault();
    getCart()
    .then(cart=>{
        document.cookie = `cart=${cart};path=/`; //upload cart to cookie
        location.href = '/cart';
    })
})

//user general logic
const username = getCookieValue("username")
if(username){
    $userLink.innerHTML = username;
}
$userLink.addEventListener('click',(e)=>{
    if($userLink.innerHTML === 'Account')
        $userModal1.style.display = "flex";
    else
        $userModal2.style.display = "flex";

})

//User login/register modal
$userModal1.addEventListener('click',(e)=>{
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
    if(e.target === $userModal1)
        $userModal1.style.display = "none";
    if(e.target === $modalCloseButton[0])
        $userModal1.style.display = "none";
})
$loginSubmitButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    $loginSubmitButton.disabled = true;
    const $loginEmail = document.querySelector('#login-email');
    const $loginPassword = document.querySelector('#login-password');
    let cart = [];
    if(localStorage.getItem('cart'))
        cart = JSON.parse(localStorage.getItem('cart'));
    try{
        axios.post('/user/login',{
            email: $loginEmail.value,
            password: $loginPassword.value,
            cart
        })
        .then(response=>{
            localStorage.removeItem('cart');
            location.href=location.href;
        })
        .catch(err=>{
            console.log(err.response.data)
        })
    }
    catch(err){
        console.log(err)
    }
})
$registerSubmitButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    const $firstName = document.querySelector('#register-first-name');
    const $lastName = document.querySelector('#register-last-name');
    const $email = document.querySelector('#register-email');
    const $password = document.querySelector('#register-password');
    const $dateOfBirth = document.querySelector('#register-dob');
    let cart = [];
    if(localStorage.getItem('cart'))
        cart = JSON.parse(localStorage.getItem('cart'));
    try{
        axios.post('/user/new',{
            firstName: $firstName.value,
            lastName: $lastName.value,
            email: $email.value,
            password: $password.value,
            dateOfBirth: $dateOfBirth.value,
            cart
        })
        .then(response=>{location.href=location.href;})
        .catch(err=>{
            console.log(err.response.data)
        })
    }
    catch(err){
        console.log(err);
    }
})

//User edit/logout modal
$userModal2.addEventListener('click',(e)=>{
    if(e.target === $userModal2)
        $userModal2.style.display = "none";
    if(e.target === $modalCloseButton[1])
        $userModal2.style.display = "none";
    if(e.target === $modalFormButtons[3]){ //logout
        axios.post('/user/logout')
        .then(response=>{
            document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.setItem('cart','[]');
            location.reload();
        })
    }
})
$editUserButton.addEventListener('click', async(e)=>{
    e.preventDefault();
    const $firstName = document.getElementById('edit-first-name');
    const $lastName = document.getElementById('edit-last-name');
    const $password = document.getElementById('edit-password');
    const $dob = document.getElementById('edit-dob');
    const $response = document.getElementById('edit-response');
    const toEdit = {};
    if($firstName.value!=="") toEdit.firstName = $firstName.value;
    if($lastName.value!=="") toEdit.lastName = $lastName.value;
    if($password.value!=="") toEdit.password = $password.value;
    if($dob.value!=="") toEdit.dateOfBirth = $dob.value;
    if(Object.keys(toEdit).length===0) return;
    $editUserButton.disabled = true;
    axios.patch('/user/edit',toEdit)
    .then(response=>response.data)
    .then(data=>{
        $response.innerHTML = data;
    })
    .catch(err=>{
        $response.innerHTML = err.response;
    })
    setTimeout(()=>{
        $response.innerHTML="";
        $firstName.value = "";
        $lastName.value = "";
        $password.value = "";
        $dob.value = "";
        $editUserButton.disabled = false;
    },2000)
})

window.onresize = () => setNavbarVisibility();
setNavbarVisibility();