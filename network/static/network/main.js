import { alert, getCookie } from './utils.js';
import { generatePost } from './generator.js';


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#index").addEventListener('click', () => loadView("index"));
    document.querySelector("#profile")?.addEventListener('click', () => loadView("profile"));
    document.querySelector('#create_post')?.addEventListener('click', () => createPost());
    loadView('index');
});


function loadView(page){

    let homeview = document.querySelector("#home-view");
    let profileview = document.querySelector("#profile-view");

    homeview.style.display = 'none';
    profileview.style.display = 'none';

    if (page === "profile"){
        homeview.style.display = 'none';
        profileview.style.display = 'block';

    } else if(page === "index"){
        homeview.style.display = 'block';
        profileview.style.display = 'none';

        loadPosts("index")
    }

}


async function loadPosts(page){

    let url

    if (page === 'index'){
        url = '/posts'
    }


    try{
        const request = await fetch(url);
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