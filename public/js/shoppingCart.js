const token = getCookieValue('userToken');
const $cartList = document.querySelector('#cart-list');
const $totalPrice = document.querySelector('#checkout-data');
const $books = [...document.querySelectorAll('.book-container')]
const $decButtons = [...document.querySelectorAll('.dec-amount')];
const $incButtons = [...document.querySelectorAll('.inc-amount')];
const $deleteButtons = [...document.querySelectorAll('.delete-book')];
const $amounts = [...document.querySelectorAll('.amount')];
const $prices = [...document.querySelectorAll('.price')];
const $bookIds = [...document.querySelectorAll('.book-id')];
const $checkoutButton = document.getElementById('checkout-button');
const $pageMessage = document.getElementById('cart-message');
const $checkoutMessage = document.getElementById('checkout-message');
const $rtsButton = document.getElementById('rts-button');
const maxAmounts = [];
var t;

//Util funcs
const checkEmptyCart = () =>{
    if(parseInt($totalPrice.innerHTML)===0){
        document.querySelector('#checkout-area').style.display="none";
        document.querySelector('#books-container').style.display="none";
        document.querySelector('#cart-message').style.display="block";
        localStorage.removeItem('cart');
    }
}
const changeItemAmount = (id,val) =>{
    const cart = JSON.parse(localStorage.getItem('cart'));
    const index = cart.findIndex(book=>book._id===id)
    cart[index].amount+=val;
    localStorage.setItem('cart',JSON.stringify(cart));
}
const removeFromCart = (id)=>{
    let cart = JSON.parse(localStorage.getItem('cart'));
    const index = cart.findIndex(book=>book._id===id)
    cart.splice(index,1);
    localStorage.setItem('cart',JSON.stringify(cart));
}
const resetTimer = () =>{
    clearTimeout(t);
    t = setTimeout(()=>{saveChangesToUser()},1000);
}
const saveChangesToUser = async ()=>{
    axios.patch('/user/edit',{
        cart: JSON.parse(localStorage.getItem('cart'))
    })
    .then(response=>response.data)
    .then(data=>{
        console.log(data);
    })
    .catch(err=>{
        console.log(err.response)
    })
}
const getMaxAmounts = async ()=>{
    $bookIds.forEach(async (id,i)=>{
        let bookData = await axios.get(`/b/${id.innerHTML}/data`);
        bookData = bookData.data;        
        maxAmounts[i] = bookData.amountInStock;
    })
}
const updateBooks = async()=>{
    const toEdit = [];
    $bookIds.forEach((id,i)=>{
        toEdit.push({
            _id:id.innerHTML,
            amount: $amounts[i].innerHTML
        })
    })
    await axios.patch('b/checkout',toEdit)
}

getMaxAmounts();

//hide empty cart message if not empty
if($books.length!==0) $pageMessage.style.display="none";

//save cart in local storage for changes
if(getCookieValue('cart')!=='null')
    localStorage.setItem('cart',getCookieValue('cart'));

$rtsButton.addEventListener('click',()=>{
    location.href = '/'
})

$decButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>{
        let amount = parseInt($amounts[i].innerHTML);
        const price = parseInt($prices[i].innerHTML)/amount;
        const totalPrice = parseInt($totalPrice.innerHTML)-(price*amount);
        if(amount>1) {
            amount--;
            $amounts[i].innerHTML = amount.toString();
            $prices[i].innerHTML = (amount*price).toString()+'$';
            $totalPrice.innerHTML = (totalPrice+(price*amount)).toString()+'$';
            changeItemAmount($bookIds[i].innerHTML,-1);
            if(token) resetTimer();
        }         
    })
})

$incButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>{
        let amount = parseInt($amounts[i].innerHTML);
        const price = parseInt($prices[i].innerHTML)/amount;
        const totalPrice = parseInt($totalPrice.innerHTML)-(price*amount);
        if(amount<maxAmounts[i]) {
            amount++;
            $amounts[i].innerHTML = amount.toString();
            $prices[i].innerHTML = (amount*price).toString()+'$';
            $totalPrice.innerHTML = (totalPrice+(price*amount)).toString()+'$';
            changeItemAmount($bookIds[i].innerHTML,1);
            if(token) resetTimer();
        }
    })
})

$deleteButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>{
        let amount = parseInt($amounts[i].innerHTML);
        const price = parseInt($prices[i].innerHTML)/amount;
        let totalPrice = parseInt($totalPrice.innerHTML)-(price*amount);
        $totalPrice.innerHTML = totalPrice.toString()+'$';
        removeFromCart($bookIds[i].innerHTML);        
        $books[i].remove();
        checkEmptyCart();
        if(token) resetTimer();
    })
})

if($checkoutButton)
    $checkoutButton.addEventListener('click', async ()=>{
        $checkoutButton.disabled = true;
        if(token){ //user logged in
            let response = await axios.patch('/user/edit',{
            cart: []
            })
            if(response.status!==200){
                $checkoutButton.disabled = false;
                return console.log(response);
            }
        }
        //update books data in db
        updateBooks();
        //delete cart from cookie and local storage
        document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('cart');
        $checkoutMessage.style.display = 'flex';
        $checkoutButton.disabled = false;
    })