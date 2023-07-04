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
        return "home";
    } else if (getComputedStyle(document.querySelector("#profile-view")).display === "block") {
        return "profile";
    }    
        
}


export function getURL(page_number, id) {
    
    let url;

    if (id) {
        url = `${id}/posts?page=${page_number}`
    } else {
        url = `/posts?page=${page_number}`
    }

    return url;
}