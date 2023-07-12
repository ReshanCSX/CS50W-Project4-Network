// JavaScript function to acquire the CSRF token: https://docs.djangoproject.com/en/4.2/howto/csrf/
export function getCookie(name) {
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


export function alert(type, message){
    const alert = document.querySelector("#alert");
    alert.innerHTML += message;
    alert.style.display = 'block';
    alert.classList.add(`alert-${type}`);
    window.scrollTo(0,0);
}


export function getCurrentView() {

    if (getComputedStyle(document.querySelector("#home-view")).display === "block") {
        return "index";
    } else if (getComputedStyle(document.querySelector("#profile-view")).display === "block") {
        return "profile";
    } if (getComputedStyle(document.querySelector("#following-view")).display === "block"){
        return "following";
    }    
        
}


export function getURL(page_number, id) {
    
    let url;
    const current_view = getCurrentView();

    if (id) {
        url = `${id}/posts?page=${page_number}`;

    } else if (current_view === 'following') {
        url = `/following?page=${page_number}`;
        
    } else if(current_view === 'index') {
        url = `/posts?page=${page_number}`;
    }

    return url;
}

export function getId(){
    const current_view = getCurrentView();
    if (current_view === "profile"){

        const id = document.querySelector("#profile_name").dataset.id;
        return id;

    } else{
        
        return null;
    }
  
}

export function getPostBody(element) {
    const post_div = element.closest('.post_container');
    const post_body = post_div.querySelector('.post_body');
    return post_body;
}

export function likeCountMessage(count) {

    let message

    if(count > 1){
        message = `${count} Likes.`;
    } else if(count == 1){
        message = `${count} Like.`;
    } else {
        message = "Be the first one to like this.";
    }

    return message
}