import {status} from "../../common/status.js";

class PostListRetriever {
    constructor(conf) {
        try {
            fetch('/api/posts', {
                method: 'GET'
            }).then(status)
                .then(response => response.json())
                .then(response => {
                    conf.onLoad(response)
                })
        } catch (error) {
            console.log(error.message, 'error');
        }
    }
}

export {PostListRetriever}