import {PostRetriever} from "../../models/retriever/postRetriever.js";
import {onCheck} from "../../common/check.js";
import {FormComment} from "../../form/formComment.js";
import {QueryParams} from "../../common/queryParams.js";

onCheck({
    onLogged: () => {
        const form = document.getElementById('comment')

        const retriever = new PostRetriever({
            id: QueryParams.id,
            onLoad: (response) => {
                const post = {
                    id: response.id,
                    title: response.title,
                    username: response.username,
                    createdAt: new Date(response.created_at),
                    modifiedAt: new Date(response.modified_at),
                    content: response.content
                }
                const el = document.getElementById('megacontent')

                //el.textContent = response.title
                document.title = `Treedit - ${post.title}`
                el.querySelector('h2').textContent = post.title
                el.querySelector('header').textContent = `Postato da ${post.username} il ${post.createdAt.toLocaleDateString()} - Ultima modifica il ${post.modifiedAt.toLocaleDateString()}`
                el.querySelector('p').textContent = post.content
                form.querySelector('input[name=postId]').value = post.id
            }
        })

        const formComment = new FormComment({
            form: document.getElementById('comment')
        })
    },
})