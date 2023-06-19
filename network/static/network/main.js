document.addEventListener('DOMContentLoaded', function(){
    
    contentLoad('home')
})


async function contentLoad(page) {

    const request = await fetch(`posts/${page}`);
    const response = await request.json();

    homepage = document.querySelector('#home_view');

    response.forEach(post => {
        const content = document.createElement('div');

        content.innerHTML = `
            <div class="row mb-2">
                <div class="col-auto small text-muted">${post.author}</div>
                <div class="col-auto small text-muted">${post.timestamp}</div>
            </div>

            <div class="row mb-2">
                <div class="col-12">${post.post}</div>
            </div>

            <div class="row">
                <div class="col-auto small text-muted"><i class="bi bi-heart style="font-size: 2rem; color: cornflowerblue;"></i>  0</div>
            </div>
            
            `

        content.classList.add('col-12', 'border', 'rounded', 'p-3', 'pb-2', 'my-1')
        homepage.append(content)
    });
    
}