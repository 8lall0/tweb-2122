import {status} from "../../common/status.js";

class PostRetriever {
    constructor(conf) {
        this._onLoadCb = conf.onLoad
        this._id = conf.id

        try {
            fetch(`/api/post?id=${this._id}`, {
                method: 'GET'
            }).then(status)
                .then(response => response.json())
                .then(response => {
                    this._onLoadCb(response)
                })
        } catch (error) {
            console.log(error.message, 'error');
        }
    }
}

export {PostRetriever}