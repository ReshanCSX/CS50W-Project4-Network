import { alert, getCookie } from './utils.js';
import { generatePost } from './generator.js';


document.addEventListener('DOMContentLoaded', function(){

    document.querySelector('#nav-active').addEventListener('click', (event) => {event.preventDefault(); loadposts(event);});
    document.querySelector('#create_post').addEventListener('click', () => createPost());

    let active_page = document.querySelector('#nav-active');

    if(active_page){
        loadposts(active_page);
    }

});

async function loadposts(event){

    document.querySelector("#posts").innerHTML = "";

    let page = "All Posts";

    if (event.innerHTML === 'All Posts'){
        page = "/posts"
    }

    try{
        const request = await fetch(page);
        const response = await request.json();
        console.log(response)

        response.forEach(content => {
            const element = document.querySelector("#posts");

            const post = generatePost(content);

            element.append(post);
        });
    }
    catch(error){
        console.log(error)
    }

}

async function createPost(){

    try{
        const request = await fetch('/posts', {
            
            method : 'POST',
            credentials: 'same-origin',
            headers: {

                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken' : getCookie("csrftoken"),
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                content : document.querySelector('#post_content').value
            })

        });

        const response = await request.json();
        console.log(response);

    }
    catch(error){
        console.log(error)
    }


}