let amountToAdd = 1;

const $amountToAdd = document.getElementById('amount');
const $decAmount = document.getElementById('dec-amount');
const $incAmount = document.getElementById('inc-amount');
const $addToCartButton = document.getElementById('add-to-cart-button');

const bookID = document.getElementById('book-id').innerHTML.replace("ID:","");
const amountInStock = parseInt(document.getElementById('book-amount').innerHTML.replace('In stock: ',''));
const $serverResponse = document.getElementById('server-response');

$amountToAdd.innerHTML = amountToAdd;

//hide buttons if 0 in stock
if(amountInStock===0){
    $amountToAdd.innerHTML = 'Currently out of stock!';
    $decAmount.style.display = 'none';
    $incAmount.style.display = 'none';
    $addToCartButton.style.display = 'none';
}

$decAmount.addEventListener('click',()=>{
    if(amountToAdd>1) amountToAdd--;
    $amountToAdd.innerHTML = amountToAdd;
})

$incAmount.addEventListener('click',()=>{
    if(amountToAdd<amountInStock) amountToAdd++;
    $amountToAdd.innerHTML = amountToAdd;
})

$addToCartButton.addEventListener('click', async ()=>{
    $addToCartButton.disabled = true;
    if(getCookieValue('userToken')) //logged in
        axios.patch('/user/addToCart',{
            _id:bookID,
            amount:amountToAdd
        })
        .then(response=>response.data)
        .then(data=>{
            $serverResponse.innerHTML = data;
        })
    else{ //anonymous cart  
        if(localStorage.getItem('cart')&&localStorage.getItem('cart')!=='null'){ //cart already exists
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
        $serverResponse.innerHTML = "Book added to cart!";       
    }
    setTimeout(()=>{
        $addToCartButton.disabled = false;
        $serverResponse.innerHTML = "";
    },2000)
})
