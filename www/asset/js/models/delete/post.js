import {status} from "../../common/status.js";

class Post {
    constructor(conf) {
        this._id = conf.id
        this._onPostCb = conf.onPost ?? null
        this._onErrorCb = conf.onError ?? null

        try {
            fetch(`/api/post?id=${this._id}`, {
                method: 'DELETE',
            }).then(status)
                .then(response => {
                this._onPostCb(response)
            })
        } catch (error) {
            if (this._onErrorCb !== null) {
                this._onErrorCb(error)
            }
        }
    }
}

export {Post}