import {Post} from "../../models/post.js";
import {QueryParams} from "../../common/queryParams.js";
import {onCheck} from "../../common/check.js";
import {FormPost} from "../../form/formPost.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#edit-post')

        if (!QueryParams.id) {
            window.location.replace('/')
            return
        }

        new FormPost({
            form: form,
            isEdit: true,
            postId: QueryParams.id,
        })
    },
})