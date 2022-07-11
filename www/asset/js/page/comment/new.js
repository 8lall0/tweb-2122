import {Comment} from "../../models/comment.js";
import {onCheck} from "../../common/check.js";
import {QueryParams} from "../../common/queryParams.js";
import {FormComment} from "../../form/formComment.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#new-comment')
        form.querySelector('[name=postId]').value = QueryParams.postId

        new FormComment({
            form: form,
            postId: QueryParams.postId,
        })
    },
})