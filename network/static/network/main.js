
import { alert, getCookie, getCurrentView, getURL } from './utils.js';
import { generatePost } from './generator.js';


let CURRENT_PAGE_NUMBER = 1;


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#index").addEventListener('click', () => loadView("index"));
    document.querySelector("#create_post")?.addEventListener('click', () => createPost());


    // Paginator page number eventlistner
    document.querySelectorAll(".paginator-num").forEach(number => {

        number.addEventListener("click", event => {

            let url;

            if (getCurrentView() === 'profile'){
                const user_id = document.querySelector("#profile_name").dataset.id;
                url = getURL(event.target.innerHTML, user_id);
            }
            else{
                url = getURL(event.target.innerHTML);
            }
            
            loadPosts(url);

        })
    })

    // Paginator previous button eventlistner
    document.querySelector("#paginator-previous").addEventListener("click", () => {
        const url = getURL(CURRENT_PAGE_NUMBER - 1)
        loadPosts(url);
    })

    // Paginator next button eventlistner
    document.querySelector("#paginator-next").addEventListener("click", () => {
        const url = getURL(CURRENT_PAGE_NUMBER + 1)
        loadPosts(url);
    })

    // Load profile page when clicked on nav bar link
    const profileElement = document.querySelector("#profile");

    profileElement?.addEventListener('click', () => {
        const value = profileElement.dataset.id;
        loadView("profile", value);
    });


    // Loading the view when the page first renders
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

        const url = getURL(page_number, id);

        // Loading posts
        loadPosts(url);

    } else if(view === "index"){

        // Setting the view
        homeview.style.display = 'block';
        profileview.style.display = 'none';

        // Building the URL
        const url = getURL(page_number)
        
        // Loading posts
        loadPosts(url)
    }

}

async function loadProfile(id){
    const url = `/user/${id}`; 
    
    try{
        const request = await fetch(url);
        const response = await request.json();


async function loadProfile(id){

    const url = `/user/${id}`;
    
    try{
        const request = await fetch(url);
        const response = await request.json();

        let profile_name = document.querySelector("#profile_name");
        let followers_count = document.querySelector("#followers_count");
        let following_count = document.querySelector("#following_count");

        profile_name.innerHTML = response.username;
        profile_name.dataset.id = response.id;
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

      
        // Update paginator numbers
        updatePaginator(response.paginator);

        // Update globle page number
        CURRENT_PAGE_NUMBER = parseInt(response.paginator.page_number);

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
        loadView("index");

    }
    catch(error){
        console.log(error)
    }


}


function updatePaginator(data){

    const pages = data.page_count;
    let current_page = data.page_number;

    // Enable or disable nextpage button 
    if (!data.has_next){
        document.querySelector("#next_page").classList.add("disabled");
    }
    else{
        document.querySelector("#next_page").classList.remove("disabled");
    }

    // Enable or disable previous page button
    if(!data.has_previous){
        document.querySelector("#previous_page").classList.add("disabled");
    }
    else{
        document.querySelector("#previous_page").classList.remove("disabled");
    }

    // Setting each page numbers
    document.querySelectorAll(".paginator-num").forEach(paginator_item => {

        paginator_item.parentNode.classList.remove("disabled");

        paginator_item.innerHTML = current_page;

        if (current_page > pages){
            paginator_item.parentNode.classList.add("disabled");
        }

        current_page++;
    });
}




// check if the event listner added
// let eventListenersAdded = false;

// function updatePaginator(data){
    
//     // Paginator configerations

//     let page_number = data.paginator.page_number;
//     let page_count = data.paginator.page_count;

//     document.querySelectorAll(".paginator-num").forEach(paginator_item => {

//         paginator_item.innerHTML = page_number

//         if (page_number > page_count){
//             paginator_item.parentNode.classList.add("disabled");
//         }



//             paginator_item.addEventListener('click', event => {

//                 const url = getURL(event.target.innerHTML);
//                 console.log(event.target.innerHTML);
//                 const currentView = getCurrentView();

//                 loadPosts(url, (currentView)? currentView : null);
                
//             });


//         page_number++
//     });

//     eventListenersAdded = true;
// }