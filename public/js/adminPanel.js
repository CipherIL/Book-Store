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