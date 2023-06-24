document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#create_post').addEventListener('click', () => createpost());

});


// JavaScript function to acquire the CSRF token: https://docs.djangoproject.com/en/4.2/howto/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function createpost(){

    try{
        const request = await fetch('/create', {
            
            method : 'POST',
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            body : JSON.stringify({
                content : document.querySelector('#post_content').value
            })


        });

        const response = await request.json();

        if(response.error){
            console.log(response)
        }

    }
    catch(error){
        console.log(error)
    }


}