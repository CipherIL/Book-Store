// const axios = require('axios');
const $formButton = document.getElementById('form-button');
const $searchResultsDisplayer = document.getElementById('search-results');

$formButton.addEventListener('click',(e)=>{
    e.preventDefault();
    const formSearchByValue = document.querySelector('input[name="search-by"]:checked').value;
    const formTextValue = document.getElementById('text').value;
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


