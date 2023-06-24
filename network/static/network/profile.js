document.addEventListener('DOMContentLoaded', function(){
    followButton()

    // document.querySelector('#follow_button').addEventListener('click', follow);
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

async function followButton() {
    
    const request = await fetch(`/users/1`)
    const response = await request.json()

    console.log(response)

    
    const follow_section = document.querySelector("#follow_section");

    const button = document.createElement("button");
    button.innerHTML = "Follow"

    button.classList.add('btn', 'btn-primary');
    button.dataset.user_id = 1;
    button.dataset.data_state = true; 

    button.addEventListener('click', follow)

    follow_section.append(button);
}



async function follow(event) {

    event.preventDefault();

    const id = event.target.dataset.user_id
    const follow = event.target.dataset.data-state

    try{
        await fetch(`/follow/${id}`, {
            method : "POST",
            headers: {"X-CSRFToken": getCookie("csrftoken")},
            body: JSON.stringify({
                follower: follow
              })
        }).then(response => {
            console.log(response);
        });

    }
    catch(error){
        console.log(error);
    }
        

}