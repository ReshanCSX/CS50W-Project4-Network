import { alert, getCookie } from './utils.js';


document.addEventListener('DOMContentLoaded', function(){
    // document.querySelector('#nav_home').addEventListener('click', () => loadposts(index))
    document.querySelector('#create_post').addEventListener('click', () => createPost());
});

// async function loadposts(view){
//     const view = view

//     if (view === index){
//         try{
//             const request = await fetch('/posts/all')
//             response = request.json()
//             console.log(response)
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
// }

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

        console.log(response.code)

    }
    catch(error){
        console.log(error)
    }


}