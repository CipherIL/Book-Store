//get modals
const $modals = [document.getElementById('add-admin-modal'),
                 document.getElementById('edit-book-modal'),
                 document.getElementById('add-new-book-modal'),
                 document.getElementById('edit-user-modal')];
//get modal buttons
const $modalButtons = [document.getElementById('add-admin-button'),
                       document.getElementById('edit-book-button'),
                       document.getElementById('add-new-book-button'),
                       document.getElementById('edit-user-button')];

//get modal close buttons
const $modalCloseButtons = [...document.getElementsByClassName('close')];

//get book edit return buttons
const $editReturnButtons = [...document.getElementsByClassName('return')]

//get modal submit buttons
const $addAdminSubmit = document.getElementById('add-admin-submit');
const $addNewBookSubmit = document.getElementById('add-new-book-submit');
const $editBookSearchSubmit = document.getElementById('search-form-button');
const $editBookSubmit = document.getElementById('edit-book-submit');

//get logout button
const $logoutButton = document.getElementById('logout');

//set modal show/hide configs
$modalButtons.forEach((button,index)=>{
    button.onclick = ()=>{
        $modals[index].style.display="flex";
    }
})
$modalCloseButtons.forEach((button,index)=>{
    button.onclick = ()=>{
        $modals[index].style.display="none";
    }
})
$modals.forEach((modal)=>{
    modal.addEventListener('click',(e)=>{   
        if(e.target===modal)
            modal.style.display="none";
    })
})

//Modal event listeners
$addAdminSubmit.addEventListener('click', async (e)=>{
    e.preventDefault();
    $addAdminSubmit.disabled = true;
    const email = document.getElementById('add-admin-form-email');
    const password = document.getElementById('add-admin-form-password');
    const $responseField = document.getElementById('add-admin-form-response');
    $responseField.innerHTML = "Loading ...";
    try{
        const response = await axios.post('/admin/new',{
            email:email.value,
            password:password.value
        })
        $responseField.innerHTML = response.data;
        
    }catch(err){
        $responseField.innerHTML = err.response.data;
    }
    setTimeout(() => {
        $responseField.innerHTML="";
        email.value = "";
        password.value = "";
        $addAdminSubmit.disabled = false;
    }, 2000);
})

$editReturnButtons[0].addEventListener('click',()=>{ //edit book return button
    document.getElementById('edit-book').hidden = true;
    document.getElementById('search-book').hidden = false;
})

$editBookSubmit.addEventListener('click', async (e)=>{
    e.preventDefault();
    $editBookSubmit.disabled = true;
    const $bookID = document.getElementById('edit-book-id');
    const $bookName = document.getElementById('edit-book-name');
    const $bookAuthor = document.getElementById('edit-book-author');
    const $bookDescription = document.getElementById('edit-book-description');
    const $bookPrice = document.getElementById('edit-book-price');
    const $bookQuantity = document.getElementById('edit-book-quantity');
    const $bookImageURL = document.getElementById('edit-book-image');
    const $editResult = document.getElementById('edit-book-response');
    try{
        axios.patch(`/b/edit/${$bookID.innerHTML}`,{
            name:$bookName.value,
            author:$bookAuthor.value,
            description:$bookDescription.value,
            price:$bookPrice.value,
            amountInStock:$bookQuantity.value,
            imageURL:$bookImageURL.value    
        })
        .then(response=>response.data)
        .then(data=>{
            $editResult.innerHTML = data;
        })
    }
    catch(err){
        $editResult.innerHTML = err.response.data;
    }
    setTimeout(()=>{
        $editBookSubmit.disabled = false;
        $editResult.innerHTML = "";
    },2000)
})

$addNewBookSubmit.addEventListener('click', async (e)=>{
    e.preventDefault();
    $addNewBookSubmit.disabled = true;
    const bookName = document.getElementById('add-new-book-name');
    const bookAuthor = document.getElementById('add-new-book-author');
    const bookDescription = document.getElementById('add-new-book-description');
    const bookPrice = document.getElementById('add-new-book-price');
    const bookQuantity = document.getElementById('add-new-book-quantity');
    const bookImageURL = document.getElementById('add-new-book-image');
    const $responseField = document.getElementById('add-new-book-response');

    try{
        const response = await axios.post('/b',{
            name:bookName.value,
            author:bookAuthor.value,
            description:bookDescription.value,
            price:bookPrice.value,
            amountInStock:bookQuantity.value,
            imageURL:bookImageURL.value
        })
        $responseField.innerHTML = response.data;
    }
    catch(err){
        $responseField.innerHTML = err.response.data;
    }
    setTimeout(()=>{
        $addNewBookSubmit.disabled = false;
        $responseField.innerHTML = "";
        bookName.value = ""
        bookAuthor.value = ""
        bookDescription.value = ""
        bookPrice.value = ""
        bookQuantity.value = ""
        bookImageURL.value = ""
    },2000)
})

$logoutButton.addEventListener('click',()=>{
    axios.post('/admin/logout')
    .then(response=>{
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        location.href = '/admin';
    })
})