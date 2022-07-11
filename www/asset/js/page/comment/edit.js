import {QueryParams} from "../../common/queryParams.js";
import {onCheck} from "../../common/check.js";
import {FormComment} from "../../form/formComment.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#edit-comment')

        if (!QueryParams.id) {
            window.location.replace('/')
            return
        }

        new FormComment({
            form: form,
            postId: QueryParams.postId,
            isEdit: true
        })
    },
    onError: () => {}//window.location.replace('/'),
})