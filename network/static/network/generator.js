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