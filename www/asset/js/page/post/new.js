import {Post} from "../../models/post.js";
import {onCheck} from "../../common/check.js";

onCheck({
    onLogged: () => {
        new Post({
            form: document.querySelector('#new-post'),
            onPost: (response) => {
                window.location.replace(`/?id=${response.id}`);
            },
        })
    },
    onError: () => {}
})