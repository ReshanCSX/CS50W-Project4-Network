import { alert, getCookie, updatePaginator, getCurrentView } from './utils.js';
import { generatePost } from './generator.js'; 


// Improve paginator

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#index").addEventListener('click', () => loadView("index"));
    document.querySelector('#create_post')?.addEventListener('click', () => createPost());

    // Load profile page when clicked on nav bar link
    const profileElement = document.querySelector("#profile");

    profileElement?.addEventListener('click', () => {
        const value = profileElement.dataset.id;
        loadView("profile", value);
    });

    loadView("index");
});


function loadView(view, id){


    let homeview = document.querySelector("#home-view");
    let profileview = document.querySelector("#profile-view");

    homeview.style.display = 'none';
    profileview.style.display = 'none';

    const page_number = 1

    if (view === "profile"){

        // Setting the view
        homeview.style.display = 'none';
        profileview.style.display = 'block';

        loadProfile(id);

        // Building the URL
        const url = `${id}/posts?page=${page_number}`

        // Loading posts
        loadPosts(url)

    } else if(view === "index"){

        // Setting the view
        homeview.style.display = 'block';
        profileview.style.display = 'none';

        // Building the URL
        const url = `/posts?page=${page_number}`

        // Loading posts
        loadPosts(url)
    }

}

async function loadProfile(id){
    const url = `/user/${id}`; 
    
    try{
        const request = await fetch(url);
        const response = await request.json();

        let profile_name = document.querySelector("#profile_name");
        let followers_count = document.querySelector("#followers_count");
        let following_count = document.querySelector("#following_count");

        profile_name.innerHTML = response.username;
        followers_count.innerHTML = response.followers;
        following_count.innerHTML = response.following;
    }   
    catch(error){
        console.log(error);
    }
}


async function loadPosts(url){

    document.querySelector("#posts").innerHTML = "";


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


        // Adding event listners to usernames
        document.querySelectorAll(".username")?.forEach(username => {
            username.addEventListener('click', event => {
                const user_id = event.target.dataset.id;
                loadView('profile', user_id);
            });
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