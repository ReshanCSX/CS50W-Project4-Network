import { alert, getCookie } from './utils.js';


document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#create_post').addEventListener('click', () => createPost());
});

async function createPost(){

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
            const message = response.error
            alert("danger", message)
        }

    }
    catch(error){
        console.log(error)
    }


}