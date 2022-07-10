import {status} from "../../common/status.js";

class Comment {
    constructor(conf) {
        this._id = conf.id
        this._onPostCb = conf.onPost
        this._onErrorCb = conf.onError

        try {
            fetch(`/api/comment?id=${this._id}`, {
                method: 'DELETE',
            }).then(status)
                .then(response => response.json())
                .then(response => {
                    this._onPostCb(response)
                })
        } catch (error) {
            this._onErrorCb(error)
        }
    }
}

export {Comment}