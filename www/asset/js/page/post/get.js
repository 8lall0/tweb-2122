import {PostRetriever} from "../../models/retriever/postRetriever.js";
import {onCheck} from "../../common/check.js";
import {QueryParams} from "../../common/queryParams.js";
import {CommentListRetriever} from "../../models/retriever/commentListRetriever.js";
import {Post as PostDelete} from "../../models/delete/post.js";
import {Comment as CommentDelete} from "../../models/delete/comment.js";

onCheck({
    onLogged: (response) => {
        const userId = parseInt(response.id)
        const id = QueryParams.id
        const el = document.querySelector('#post-content')

        if (id === null) {
            window.location.replace('/')
            return
        }

        document.querySelector('#answer-comment').href = `/comment/new?postId=${id}`

        new PostRetriever({
            id: id,
            onLoad: (response) => {
                const post = {
                    id: response.id,
                    title: response.title,
                    username: response.username,
                    createdAt: new Date(response.created_at),
                    modifiedAt: new Date(response.modified_at),
                    content: response.content
                }
                
                document.title = `${post.title} - Treedit`
                document.querySelector('h2').textContent = post.title
                el.querySelector('header').textContent = `Postato da ${post.username} il ${post.createdAt.toLocaleDateString()} - Ultima modifica il ${post.modifiedAt.toLocaleDateString()}`
                el.querySelector('p').textContent = post.content

                if (post.userId === userId) {
                    const modifyBtn = document.createElement('a')
                    modifyBtn.href = `/post/edit?id=${post.id}`
                    const cancelBtn = document.createElement('button')
                    cancelBtn.addEventListener('click', (e) => {
                        e.preventDefault()

                        new PostDelete({
                            id: post.id,
                            onPost: () => {
                                window.location.replace('/')
                            }
                        })
                    })

                    el.querySelector('aside').append(modifyBtn, cancelBtn)
                }

                new CommentListRetriever({
                    id: id,
                    onLoad: (response) => {
                        const cancelAction = (id) => {
                            new CommentDelete({
                                id: id,
                                onPost: () => {
                                    el.querySelector(`li[data-id="${id}"]`).remove()
                                },
                            })
                        }

                        const ul = document.createElement('ul')
                        for (let x of response) {
                            const comment = {
                                id: x.id,
                                userId: x.user_id,
                                userName: x.username,
                                content: x.content,
                                createdAt: new Date(x.created_at),
                                modifiedAt: new Date(x.modified_at),
                            }

                            const li = document.createElement('li')
                            const article = document.createElement('article')
                            const p = document.createElement('p')
                            const aside = document.createElement('aside')
                            const f = document.createElement('footer')


                            p.textContent = comment.content
                            aside.innerHTML = `Autore: <strong>${comment.userName}</strong>`

                            if (comment.userId === userId) {
                                const modBtn = document.createElement('a')
                                modBtn.href = `/comment/edit?id=${comment.id}`
                                modBtn.textContent = 'Modifica'

                                const cancBtn = document.createElement('button')
                                cancBtn.textContent = 'Cancella'
                                cancBtn.addEventListener('click', () => {
                                    cancelAction(comment.id)
                                })

                                aside.appendChild(modBtn)
                                aside.appendChild(cancBtn)
                            }
                            f.innerHTML = `Creato il <em>${comment.createdAt.toLocaleDateString()}</em> - Modificato il <em>${comment.modifiedAt.toLocaleDateString()}</em>`

                            article.appendChild(p)
                            article.appendChild(aside)
                            article.appendChild(f)
                            li.dataset.id = comment.id
                            li.appendChild(article)
                            ul.appendChild(li)
                        }

                        el.appendChild(ul)
                    }
                })
            }
        })

    },
    onError: () => {
        window.location.replace('/')
    }
})