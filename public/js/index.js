const $booksContainer = document.getElementById('books-container');
const $pageNumber = document.getElementById('page-number');
const $nextButton = document.getElementById('next-button');
const $previousButton = document.getElementById('previous-button');
let count = 0;
let maxCount;

//get maximum amount of pages
const getMaxCount = async () =>{
    try{
        await axios.get('/b/get/booksCount')
        .then(response=>response.data)
        .then(data=>{
            maxCount = Math.floor(data.booksCount/8);
        })
    }catch(err){
        console.log(err);
    }
}

const renderBooks = async () => {
    $booksContainer.innerHTML = "Loading ...";
    $pageNumber.innerHTML = count;
    //Style pagintaion buttons
    if(count===0) $previousButton.style="opacity:0; cursor: default"
    else $previousButton.style="";
    if(count===maxCount) $nextButton.style="opacity:0; cursor: default"
    else $nextButton.style="";
    //load books
    try{
        const skip = 8*count;
        await axios.get(`/b/get/8/${skip}`)
        .then(response=> response.data)
        .then(data=>{
            $booksContainer.innerHTML="";
            data.forEach(book=>{
                //Create elements
                const bookContainer = document.createElement('div');
                const bookImage = document.createElement('img');
                const bookName = document.createElement('h1');
                const bookAuthor = document.createElement('h2');
                //Insert element data
                bookImage.src = book.imageURL;
                bookName.innerHTML = book.name;
                bookAuthor.innerHTML = "by " + book.author;
                //Assign element classes
                bookContainer.className = "book-container";
                bookImage.className = "book-image";
                bookName.className = "book-name";
                bookAuthor.className = "book-author";
                //Append elements
                bookContainer.appendChild(bookImage);
                bookContainer.appendChild(bookName);
                bookContainer.appendChild(bookAuthor);
                $booksContainer.appendChild(bookContainer);
            })
        })
        
    }
    catch(err){
        console.log(err);
    }   
}

$nextButton.addEventListener('click',()=>{
    if(count<maxCount){
        count++;
        renderBooks();
    }
})

$previousButton.addEventListener('click',()=>{
    if(count>0){
        count--;
        renderBooks();
    }
})

//render books for the first time
getMaxCount();
renderBooks();