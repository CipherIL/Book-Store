const $adminEmail = document.getElementById('form-email');
const $adminPassword = document.getElementById('form-password');
const $loginPanel = document.getElementById('login-panel');
const $loginButton = document.getElementById('form-button');

//Util funcs
const getCookieValue = (name) =>{
    let match = document.cookie.match(RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
    return match ? match[1]:null;
}

const adminToken = getCookieValue('adminToken');

const initPage = async () => {
    if(adminToken)
            location.replace('/admin/panel');
    else
        $loginPanel.hidden = false;
}

initPage();

//Login
$loginButton.addEventListener('click', async (e)=>{
    e.preventDefault();
    await axios.post('/admin/login',{
        email:$adminEmail.value,
        password:$adminPassword.value
    })
    .then(()=>{
        location.reload();
    })
    .catch(err=>{
        console.log(err.response);
    })
})