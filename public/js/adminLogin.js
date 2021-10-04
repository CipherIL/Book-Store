const $adminEmail = document.getElementById('form-email');
const $adminPassword = document.getElementById('form-password');
const $loginPanel = document.getElementById('login-panel');
const $loginButton = document.getElementById('form-button');
const adminToken = document.cookie;

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