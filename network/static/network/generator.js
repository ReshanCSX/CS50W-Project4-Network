export function generatePost(content){
    const container = document.createElement('div');

    container.innerHTML = `
    <div class="col-12 col-md-10 col-lg-8 border rounded">
        <div class="container-fluid p-3">

            <div class="row mb-3">
                <div class="col-auto small"><a href="#" data-id="${content.author}" class="username">@${content.author_name}</a></div>
                <div class="col-auto small text-muted">${content.timestamp}</div>
            </div>
            <div class="row">
                <div class="col">${content.content}</div>
            </div>
        
        </div>
    </div>
    `
    container.classList.add("row", "p-3", "bg-white", "justify-content-center");

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

    const followSection = document.createElement("div");

    followSection.innerHTML = `${(
                                    () => {
                                        if(content.is_follower){
                                            return `<button class="btn btn-danger" id="follow_button">Unfollow</button>`
                                        
                                        } else{
                                            return `<button class="btn btn-primary" id="follow_button">Follow</button>`
                                        
                                        }
                                    })()
                                }`

    
    followSection.classList.add("col");

    return followSection
}