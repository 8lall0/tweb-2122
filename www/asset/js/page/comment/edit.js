import {Comment} from "../../models/comment.js";
import {QueryParams} from "../../common/queryParams.js";
import {onCheck} from "../../common/check.js";
import {CommentRetriever} from "../../models/retriever/commentRetriever.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#edit-comment')

        if (!QueryParams.id) {
            window.location.replace('/')
            return
        }

        new CommentRetriever({
            id: QueryParams.id,
            onLoad: (response) => {
                form.querySelector('[name=id]').value = QueryParams.id
                form.querySelector('[name=content]').value = response.content

            }
        })
        new Comment({
            form: form,
            overrideMethod: 'patch',
            onPost: (response) => {
                window.location.replace(`/post?id=${response.postId}`);
            },
        })
    },
    onError: () => {}//window.location.replace('/'),
})