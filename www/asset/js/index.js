import {PostListRetriever} from "./models/retriever/postListRetriever.js";
import {onCheck} from "./common/check.js";

const setLogged = () => {
    const content = document.getElementById('content')

    const onLoad = (response) => {
        const ul = document.createElement('ul')
        ul.classList.add('post-list')

        response.forEach(el => {
            const article = {
                id: el.id,
                title: el.title,
                username: el.username,
                createdAt: new Date(el.created_at),
            }

            const link = document.createElement('a')
            link.textContent = article.title
            link.href = `/post?id=${article.id}`

            const postedBy = document.createElement('footer')
            postedBy.innerHTML = `Postato da: <strong>${article.username}</strong> il ${article.createdAt.getDay()}/${article.createdAt.getMonth()}/${article.createdAt.getFullYear()}`

            const item = document.createElement('li')
            item.appendChild(link)
            item.appendChild(postedBy)
            ul.appendChild(item)
        })
        content.appendChild(ul)
        const newBtn = document.createElement('a')
        newBtn.classList.add('btn')
        newBtn.href = '/new'
        newBtn.textContent = 'Crea post'
        content.appendChild(newBtn)
    }

    const retriever = new PostListRetriever({
        onLoad: onLoad
    })
}

const setNotLogged = () => {

}

onCheck({
    onLogged: setLogged,
    onError: setNotLogged
})

document.body.classList.add('loaded')