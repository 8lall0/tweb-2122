import {onCheck} from "../../common/check.js";
import {FormPost} from "../../form/formPost.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#new-post')

        new FormPost({
            form: form,
        })
    },
})