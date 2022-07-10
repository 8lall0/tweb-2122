import {Comment} from "../../models/comment.js";
import {onCheck} from "../../common/check.js";
import {QueryParams} from "../../common/queryParams.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#new-comment')
        form.querySelector('[name=postId]').value = QueryParams.postId

        new Comment({
            form: form,
            onPost: () => {
                console.log('asd')
                window.location.replace(`/post?id=${QueryParams.postId}`)
            },
        })
    },
    onError: () => {}
})