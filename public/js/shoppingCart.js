const token = getCookieValue('userToken');
const $cartList = document.querySelector('#cart-list');


const getCart = async () =>{
    //Logged in
    if(token){
        const response = await axios.get('/user/cart');
        if(response.status === 200)
            return response.data;
    }
    //Anonymous cart
    else{

    }
}

const renderCart = async () => {
    const cart = await getCart();
    $cartList.innerHTML = "";
    cart.forEach(async (book)=>{
        //get book data
        const response = await axios.get(`/b/${book._id}/data`);
        const bookData = response.data;
        //Create elements
        const $bookContainer = document.createElement('div');
        const $bookImage = document.createElement('img');
        const $dataContainer = document.createElement('div');
        const $bookData = document.createElement('div');
        const $bookEdit = document.createElement('div');
        const $totalPrice = document.createElement('div');
        const $bookDataName = document.createElement('h1');
        const $bookDataAuthor = document.createElement('h2');
    
        //Assign classes and ids
        $bookContainer.classList.add('book-container');
        $bookImage.classList.add('book-image');
        $dataContainer.classList.add('data-container');
        $bookData.classList.add('book-data');
        $bookEdit.classList.add('book-edit');
        $totalPrice.classList.add('book-total-price');
        $bookDataName.classList.add('')
        //Insert data
        $bookImage.src = bookData.imageURL;
        //Add Logic

        //Append elements
        $dataContainer.appendChild($bookData);
        $dataContainer.appendChild($bookEdit);

        $bookContainer.appendChild($bookImage);
        $bookContainer.appendChild($dataContainer);
        $bookContainer.appendChild($totalPrice);

        $cartList.appendChild($bookContainer);
    })
}

renderCart();