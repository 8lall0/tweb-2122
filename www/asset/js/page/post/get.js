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
        const isAdmin = response.isAdmin

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
                    userId: response.userId,
                    username: response.username,
                    createdAt: new Date(response.created_at),
                    modifiedAt: new Date(response.modified_at),
                    content: response.content
                }
                
                document.title = `${post.title} - Treedit`
                document.querySelector('h2').textContent = post.title
                el.querySelector('header').innerHTML = `Postato da <strong>${post.username}</strong> il ${post.createdAt.toLocaleDateString()} - Ultima modifica il ${post.modifiedAt.toLocaleDateString()}`
                el.querySelector('p').textContent = post.content

                if (post.userId === userId) {
                    const modifyBtn = document.createElement('a')
                    modifyBtn.href = `/post/edit?id=${post.id}`
                    modifyBtn.classList.add('icon')
                    modifyBtn.classList.add('pencil')
                    modifyBtn.title = 'Modifica'

                    el.querySelector('.post__icons').append(modifyBtn)
                }

                if (post.userId === userId || isAdmin) {
                    const cancelBtn = document.createElement('button')
                    cancelBtn.classList.add('icon')
                    cancelBtn.classList.add('trash')
                    cancelBtn.title = 'Cancella'
                    cancelBtn.addEventListener('click', (e) => {
                        e.preventDefault()

                        new PostDelete({
                            id: post.id,
                            onPost: () => {
                                window.location.replace('/')
                            }
                        })
                    })

                    el.querySelector('.post__icons').append(cancelBtn)
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
                        ul.classList.add('comment-list')
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
                            const f = document.createElement('footer')

                            p.textContent = comment.content
                            article.classList.add('comment')

                            const btnContainer = document.createElement('div')
                            btnContainer.classList.add('comment__icons')
                            li.appendChild(btnContainer)

                            if (comment.userId === userId) {
                                const modBtn = document.createElement('a')
                                modBtn.classList.add('icon')
                                modBtn.classList.add('pencil')
                                modBtn.href = `/comment/edit?id=${comment.id}`
                                modBtn.title = 'Modifica'

                                btnContainer.append(modBtn)
                            }

                            if (comment.userId === userId || isAdmin) {
                                const cancBtn = document.createElement('button')
                                cancBtn.classList.add('icon')
                                cancBtn.classList.add('trash')
                                cancBtn.title = 'Cancella'
                                cancBtn.addEventListener('click', () => {
                                    cancelAction(comment.id)
                                })

                                btnContainer.append(cancBtn)
                            }

                            f.innerHTML = `Autore: <strong>${comment.userName}</strong><br>Creato il <em>${comment.createdAt.toLocaleDateString()}</em> - Modificato il <em>${comment.modifiedAt.toLocaleDateString()}</em>`

                            article.appendChild(p)
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
})