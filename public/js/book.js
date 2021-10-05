let amountToAdd = 1;

const $amountToAdd = document.getElementById('amount');
const $decAmount = document.getElementById('dec-amount');
const $incAmount = document.getElementById('inc-amount');
const $addToCartButton = document.getElementById('add-to-cart-button');

const bookID = document.getElementById('book-id').innerHTML.replace("ID:","");
const amountInStock = parseInt(document.getElementById('book-amount').innerHTML.replace('In stock: ',''));

$amountToAdd.innerHTML = amountToAdd;


$decAmount.addEventListener('click',()=>{
    if(amountToAdd>1) amountToAdd--;
    $amountToAdd.innerHTML = amountToAdd;
})

$incAmount.addEventListener('click',()=>{
    if(amountToAdd<amountInStock) amountToAdd++;
    $amountToAdd.innerHTML = amountToAdd;
})

$addToCartButton.addEventListener('click', async ()=>{
    if(getCookieValue('userToken')) //logged in
        axios.patch('/user/addToCart',{
            _id:bookID,
            amount:amountToAdd
        });
    else{ //anonymous cart  
        if(localStorage.getItem('cart')){ //cart already exists
            const cart = JSON.parse(localStorage.getItem('cart'));
            let i;
            for(i=0;i<cart.length;i++){ //find if book already added
                if(cart[i]._id === bookID){
                    cart[i].amount+=amountToAdd;
                    break;
                }
            }
            if(i === cart.length) //book was not in cart
                cart.push({
                    _id:bookID,
                    amount:amountToAdd
                })
            localStorage.setItem('cart',JSON.stringify(cart));
        }
        else{
            localStorage.setItem('cart',JSON.stringify([{_id:bookID,amount:amountToAdd}]));
        }        
    }
})
