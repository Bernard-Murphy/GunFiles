const form = document.getElementById('login');
const error = document.querySelector('#error');
const incorrect = document.querySelector('#incorrect');
const maxed = document.querySelector('#maxed');
const messages = [incorrect, maxed, error];


form.addEventListener('submit', (e) => {

    /* Handles form submission.  */

    e.preventDefault();
    messages.forEach((message) => {
        if (!message.classList.contains("hidden")){
            message.classList.toggle("hidden");
        }
    })
    axios.post('https://guns.bernardmurphy.net/authenticate', {password: e.target[0].value})
        .then(res => {
            if (res.data === "success"){
                window.location.replace('https://guns.bernardmurphy.net');
            } else if (res.data === "invalid"){
                incorrect.classList.toggle("hidden");
            } else if (res.data === "maxed"){
                maxed.classList.toggle("hidden");
            } else {
                error.classList.toggle("hidden");
            }
        })
        .catch(err => {
            error.classList.toggle("hidden")
        })
})

function auth(){
    return false
}