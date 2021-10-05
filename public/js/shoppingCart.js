const token = getCookieValue('userToken');
const $cartList = document.querySelector('#cart-list');
const $totalPrice = document.querySelector('#checkout-data');
const $books = [...document.querySelectorAll('.book-container')]
const $decButtons = [...document.querySelectorAll('.dec-amount')];
const $incButtons = [...document.querySelectorAll('.inc-amount')];
const $deleteButtons = [...document.querySelectorAll('.delete-book')];
const $amounts = [...document.querySelectorAll('.amount')];
const $prices = [...document.querySelectorAll('.price')];
const $bookIds = [...document.querySelectorAll('.book-id')]

//Util funcs
const checkEmptyCart = () =>{
    if(parseInt($totalPrice.innerHTML)===0){
        document.querySelector('#checkout-area').style.display="none";
        document.querySelector('#books-container').style.display="none";
        document.querySelector('#empty-cart-message').style.display="block";
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

//hide empty cart message if not empty
if($books.length!==0)
document.querySelector('#empty-cart-message').style.display="none";

//save cart in local storage for changes
if(getCookieValue('cart')!=='null')
    localStorage.setItem('cart',getCookieValue('cart'));


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
        }         
    })
})

$incButtons.forEach((button,i)=>{
    button.addEventListener('click',()=>{
        let amount = parseInt($amounts[i].innerHTML);
        const price = parseInt($prices[i].innerHTML)/amount;
        const totalPrice = parseInt($totalPrice.innerHTML)-(price*amount);
        if(amount<100) {
            amount++;
            $amounts[i].innerHTML = amount.toString();
            $prices[i].innerHTML = (amount*price).toString()+'$';
            $totalPrice.innerHTML = (totalPrice+(price*amount)).toString()+'$';
            changeItemAmount($bookIds[i].innerHTML,1);
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
    })
})