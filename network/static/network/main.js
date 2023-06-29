import { alert, getCookie, updatePaginator } from './utils.js';
import { generatePost } from './generator.js';

// Improve paginator

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#index").addEventListener('click', () => loadView("index"));
    document.querySelector("#profile")?.addEventListener('click', () => loadView("profile"));
    document.querySelector('#create_post')?.addEventListener('click', () => createPost());
    loadView('index');
});


function loadView(view){

    let homeview = document.querySelector("#home-view");
    let profileview = document.querySelector("#profile-view");

    homeview.style.display = 'none';
    profileview.style.display = 'none';

    const page_number = 1

    if (view === "profile"){
        homeview.style.display = 'none';
        profileview.style.display = 'block';

        loadPosts("profile", page_number)

    } else if(view === "index"){
        homeview.style.display = 'block';
        profileview.style.display = 'none';

        loadPosts("index", page_number)
    }

}


async function loadPosts(view, page_number){

    document.querySelector("#posts").innerHTML = "";

    let url

    if (view === 'index'){
        url = `/posts?page=${page_number}`
    }

    if (view === 'profile'){
        url = `1/posts?page=${page_number}`
        console.log(url)
    }

    try{
        const request = await fetch(url);
        const response = await request.json();

        if(response.paginator.has_next == false){
            document.querySelector("#previous_page").classList.add("disabled");
        }

        if(response.paginator.has_next == false){
            document.querySelector("#next_page").classList.add("disabled");
        }

        // Appending posts
        response.serializer.forEach(content => {
            const element = document.querySelector("#posts");

            const post = generatePost(content);

            element.append(post);
        });


        updatePaginator(response);


    }
    catch(error){
        console.log(error)
    }

}

async function createPost(){

    let content = document.querySelector('#post_content');

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
                content : content.value
            })

        });

        const response = await request.json();

        content.value = "";
        loadPosts("index", 1);

    }
    catch(error){
        console.log(error)
    }


}