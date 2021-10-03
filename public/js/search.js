const $formButton = document.getElementById('search-form-button');
const $searchResultsDisplayer = document.getElementById('search-results');

$formButton.addEventListener('click',(e)=>{
    e.preventDefault();
    const formSearchByValue = document.querySelector('input[name="search-by"]:checked').value;
    const formTextValue = document.getElementById('search-text').value;
    //validate 
    if(formTextValue==="") return alert("Please enter search text");

    //DOM interaction
    $searchResultsDisplayer.innerHTML = "<h1>Loading ...</h1>";
    $formButton.disabled = true;

    //Prepare object
    const searchObj = {};
    if(formSearchByValue==='book') searchObj.name = formTextValue;
    else searchObj.author = formTextValue;
    
    //Get data
    axios.get('/b/search/get',{
        params: searchObj
    })
    .then(response=>{ return response.data})
    .then(data=>{
        $searchResultsDisplayer.innerHTML="";
        data.forEach(book=>{
            //Create elements
            const container = document.createElement('div');
            const bookImage = document.createElement('img');
            const bookName = document.createElement('p');
            const bookAuthor = document.createElement('p');
            //Insert element data
            bookImage.src = book.imageURL;
            bookName.innerHTML = book.name;
            bookAuthor.innerHTML = "by " + book.author;
            //Assign classes
            container.className = "book";
            bookImage.className = "book-image";
            bookName.className ="book-name";
            bookAuthor.className = "book-author";
            //Append
            container.appendChild(bookImage);
            container.appendChild(bookName);
            container.appendChild(bookAuthor);
            //Add functionality
            //Admin panel functionality
            if(location.href.endsWith('/admin/panel')){
                const $searchBook = document.getElementById('search-book');
                const $editBook = document.getElementById('edit-book');
                const $loadingText = document.getElementById('loading-text');
                const $bookID = document.getElementById('edit-book-id');
                const $bookName = document.getElementById('edit-book-name');
                const $bookAuthor = document.getElementById('edit-book-author');
                const $bookDescription = document.getElementById('edit-book-description');
                const $bookPrice = document.getElementById('edit-book-price');
                const $bookQuantity = document.getElementById('edit-book-quantity');
                const $bookImageURL = document.getElementById('edit-book-image');
                container.addEventListener('click', async ()=>{
                    $searchBook.hidden = true;
                    $loadingText.hidden = false;
                    try{
                        let bookData = await axios.get(`/b/${book._id}/data`);
                        bookData = bookData.data;
                        $bookID.innerHTML = bookData._id;
                        $bookName.value = bookData.name;
                        $bookAuthor.value = bookData.author;
                        $bookDescription.value = bookData.description;
                        $bookPrice.value = bookData.price;
                        $bookQuantity.value = bookData.amountInStock;
                        $bookImageURL.value = bookData.imageURL;
                        $loadingText.hidden = true;
                        $editBook.hidden = false;
                    }
                    catch(err){
                        console.log(err);
                    }
                })
            }
            //Search page functionality
            else if(location.href.endsWith('/search')){
                container.addEventListener('click',()=>{
                    location.href = `/b/${book._id}`;
                })
            }
            $searchResultsDisplayer.appendChild(container);
        })
        $formButton.disabled=false;
    })
    .catch(err=>{
        if(err.response.status === 404)
            $searchResultsDisplayer.innerHTML = "Search gave no results!"
        else console.log(err.response);
        $formButton.disabled=false;
    })
})
