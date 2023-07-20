export function generatePost(content){
    const container = document.createElement('div');

    container.innerHTML = `
    <div class="col-12 col-md-10 col-lg-8 border rounded">
        <div class="container-fluid p-3 post_container">

            <div class="row mb-3">
                <div class="col-6 small"><a href="#" data-id="${content.author}" class="username">${content.author_name}</a></div>
                <div class="col-6 text-end small text-muted">${content.timestamp}</div>
            </div>
            <div class="row mb-3">
                <div class="col post_body" id="${content.id}">${content.content}</div>
            </div> 
        </div>
    </div>
    `
    container.classList.add("row", "p-3", "bg-white", "justify-content-center", "post_div");

    return container
}

export function generateProfile(content){

    const profile = document.createElement('div');

    profile.innerHTML = `<div class="row p-3 bg-white justify-content-center">

                            <div class="col-12 col-md-10 col-lg-8 text-center align-self-center border rounded p-4">

                                <div class="row mb-2">
                                    <h4 class="my-3" id="profile_name" data-id="${content.id}">${content.username}</h4>
                                </div>


                                <div class="row mb-2" id="follow_section">
                                    
                                </div>

                                
                                <div class="row mb-2">
                                    <div class="col-6 small">
                                        Followers
                                    </div>
                                    <div class="col-6 small">
                                        Following
                                    </div>
                                    <div class="col-6" id="followers_count">
                                        ${content.followers}
                                    </div>
                                    <div class="col-6" id="following_count">
                                        ${content.following}
                                    </div>
                                </div>
                                
                            </div>

                        </div>`


        profile.classList.add("row", "p-3", "justify-content-center")

        return profile
}

export function generateFollow(content){
    const followButton = document.createElement('button');
    followButton.id = "follow_button";

    if (content.is_follower){
        followButton.innerHTML = "Unfollow";
        followButton.classList.add('btn', 'btn-danger');
    } else{
        followButton.innerHTML = "Follow";
        followButton.classList.add('btn', 'btn-primary')
    }

    return followButton
}


export function generateEditButton(){
    const edit_button = document.createElement('button');

    edit_button.innerHTML = "Edit";

    edit_button.classList.add('editButton', 'small');

    return edit_button
}


export function generateLikeButton(liked){
    const likeButton = document.createElement('button');

    if (liked){
        likeButton.innerHTML = '<i class="bi bi-heart-fill"></i> Dislike';
    } else{
        likeButton.innerHTML = '<i class="bi bi-heart"></i> Like';
    }
    
    likeButton.classList.add('likeButton', 'me-2', 'small');

    return likeButton
}

export function generatePaginator(data){

    const paginator = document.createElement('nav');

    paginator.innerHTML = `
    
        <ul class="pagination justify-content-center">
            <li class="page-item disabled" id="previous_page">
                <a class="page-link" id="paginator-previous" href="#" aria-label="Previous">
                <span aria-hidden="true">Previous</span>
                </a>
            </li>

            <li class="page-item disabled" id="next_page">
                <a class="page-link" id="paginator-next" href="#" aria-label="Next">
                <span aria-hidden="true">Next</span>
                </a>
            </li>
        </ul>
    
    `
    return paginator
}