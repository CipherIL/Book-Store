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
    
})
