

import { alert, getCookie, getCurrentView, getURL, getId, getPostBody } from './utils.js';
import { generatePost, generateProfile, generateFollow, generateEditButton } from './generator.js';


let CURRENT_PAGE_NUMBER = 1;


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#index").addEventListener('click', () => loadView("index"));
    document.querySelector("#create_post")?.addEventListener('click', () => createPost());
    document.querySelector("#following")?.addEventListener('click', () => loadView("following"));


    // Paginator page number eventlistner
    document.querySelectorAll(".paginator-num").forEach(number => {

        number.addEventListener("click", event => {


            let url = getURL(event.target.innerHTML, getId());
         
            loadPosts(url);

        })
    })

    // Paginator previous button eventlistner
    document.querySelector("#paginator-previous").addEventListener("click", () => {

        const url = getURL(CURRENT_PAGE_NUMBER - 1, getId())

        loadPosts(url);
    })

    // Paginator next button eventlistner
    document.querySelector("#paginator-next").addEventListener("click", () => {

        const url = getURL(CURRENT_PAGE_NUMBER + 1, getId())
        
        loadPosts(url);
    })


    // Load profile page when clicked on nav bar link
    const profileElement = document.querySelector("#profile");

    profileElement?.addEventListener('click', () => {
        const value = profileElement.dataset.id;
        loadView("profile", value);
    });

    // Loading the view when the page first rendered
    loadView("index");

});



function loadView(view, id){


    let homeview = document.querySelector("#home-view");
    let profileview = document.querySelector("#profile-view");
    let followingview = document.querySelector("#following-view");

    homeview.style.display = 'none';
    profileview.style.display = 'none';
    followingview.style.display = 'none';

    const page_number = 1

    if (view === "profile"){

        // Setting the view
        homeview.style.display = 'none';
        followingview.style.display = 'none';
        profileview.style.display = 'block';

        loadProfile(id);

        // Building the URL
        const url = getURL(page_number, id);

        // Loading posts
        loadPosts(url);


    } else if(view === "index"){

        // Setting the view
        homeview.style.display = 'block';
        followingview.style.display = 'none';
        profileview.style.display = 'none';
        

        // Building the URL
        const url = getURL(page_number)

        // Loading posts
        loadPosts(url)


    } else if(view === "following"){

        homeview.style.display = 'none';
        profileview.style.display = 'none';
        followingview.style.display = 'block';


        // Building the URL
        const url = getURL(page_number)

        // Loading posts
        loadPosts(url)
    }

}


async function loadProfile(id){

    const url = `/user/${id}`;
    
    try{
        // Fetch user info
        const request = await fetch(url);
        const response = await request.json();

        // Generate profile
        let profile_view = document.querySelector("#profile-view");
        const profile = generateProfile(response);
        
        // Add profile information to view
        profile_view.innerHTML = "";
        profile_view.append(profile);

        // Generating follow button

        if (response.id !== response.requested_by && response.requested_by !== null){
            let profile_section = document.querySelector("#follow_section");
            const followButton = generateFollow(response);
            
            profile_section.append(followButton);


            followButton.addEventListener('click', () =>{
                
                follow(response.id, response.is_follower ? "unfollow" : "follow")
            });
            
        }

    }   
    catch(error){
        console.log(error);
    }
}

async function follow(id, action){

    try{

        const request = await fetch(`user/${id}/follow`, {
            method: "POST",
            credentials: "same-origin",
            headers: {

                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken' : getCookie("csrftoken"),
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({action})
            
        }); 

        // fix bug
        const response = await request;

        if(response.ok){
            const content = await response.json();
            loadProfile(content.id);
        }

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

        const requested_by = response.requested_by;

        // Appending posts
        response.serializer.forEach(content => {
            addPostsToDOM(content, requested_by);
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


        // Update globle variables
        CURRENT_PAGE_NUMBER = parseInt(response.paginator.page_number);

    }
    catch(error){
        console.log(error)
    }

}

function addPostsToDOM(content, requested_by){

    const post_section = document.querySelector('#posts');

    const post = generatePost(content);

    // Check if the user is authenticated
    if (requested_by){

        // Creating the div section
        const footerSection = document.createElement('div');
        const footerCol = document.createElement('div');

        footerSection.classList.add('row', 'mb-2');
        footerCol.classList.add('col');

        footerSection.append(footerCol);

        // Checking if the requested user is the user who created the post
        if (requested_by === content.author){

            // Generating edit button and appending to the footer
            const editButton = generateEditButton();
            footerCol.append(editButton);

            // Adding an event listener to the edit button
            editButton.addEventListener('click', event => editPost(event.target, footerCol, editButton))
            
            // Appending the footer section to post container
            post.querySelector(".post_container").append(footerSection);
        }

    }

    // Appending the post to post section
    post_section.append(post);
}


function editPost(event, footerCol, editButton){

    // Getting the post content.
    const post_body = getPostBody(event);
    const post_body_copy = post_body.innerHTML;
    const post_id = post_body.id;
    
    // Creating the textarea to edit.
    const text_area = document.createElement('textarea');
    text_area.classList.add('form-control', 'textarea');
    text_area.rows = '4';

    // Passing the post body content to textarea.
    text_area.innerHTML = post_body.innerHTML;

    // Clear the div and append text area
    post_body.innerHTML = "";
    post_body.append(text_area)

    // Creating a submit and reset buttons
    const submit_button = document.createElement('button');
    const reset_button = document.createElement('button');

    submit_button.innerHTML = "Edit Post";
    reset_button.innerHTML = "Close";

    submit_button.classList.add('btn', 'btn-primary', 'btn-sm');
    reset_button.classList.add('btn', 'btn-outline-secondary', 'btn-sm')

    reset_button.addEventListener('click', () => {

        post_body.innerHTML = "";
        post_body.innerHTML = post_body_copy;

        resetEditPost(submit_button, reset_button, footerCol, editButton)
    })

    // Adding a eventlistner to submit button
    submit_button.addEventListener('click', async event => {

        const post_body = getPostBody(event.target);
        const textarea_value = post_body.querySelector('textarea').value;
        const edit_post = await submitEditedPost(post_id, textarea_value);

        if(edit_post){
            // Clearing and adding the new content to post body
            post_body.innerHTML = "";
            post_body.innerHTML = edit_post.content;

            // Resetting the view
            resetEditPost(submit_button, reset_button, footerCol, editButton)
        }
    })

    // Appending submit button
    footerCol.classList.add('d-grid', 'gap-2', 'd-md-flex', 'justify-content-md-end');
    footerCol.append(reset_button, submit_button);

    // Removing the edit button when user click on it
    editButton.remove();

}

function resetEditPost(submit_button, reset_button, footerCol, editButton){
    submit_button.remove();
    reset_button.remove();
    footerCol.append(editButton);
    footerCol.classList.remove('d-grid', 'gap-2', 'd-md-flex', 'justify-content-md-end');
}

async function submitEditedPost(postId, content){

    try{
        const request = await fetch(`/post/${postId}`, {
            method : 'PUT',
            credentials : 'same-origin',
            headers : {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken' : getCookie("csrftoken"),
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                content: content
            })
        })
        
        if(request.ok){
            const response = await request.json();
            return response;
        }
        
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

        // FURTHER DEVELOPMENT
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


