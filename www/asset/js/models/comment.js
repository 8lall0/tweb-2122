import {status} from "../common/status.js";

class Comment {
    constructor(conf) {
        this._form = conf.form;
        this._ovverrideMethd = conf.overrideMethod ? conf.overrideMethod.toUpperCase() : null
        this._onPostCb = conf.onPost
        this._onErrorCb = conf.onError

        this._form.addEventListener('submit', (e) => {
            e.preventDefault()

            try {
                fetch(e.currentTarget.action, {
                    method: this._ovverrideMethd ?? e.currentTarget.method,
                    body: new FormData(e.currentTarget),
                }).then(status)
                    .then(response => response.json())
                    .then(response => {
                        this._onPostCb(response)
                    })
            } catch (error) {
                this._onErrorCb(error)
            }
        })
    }
}

export {Comment}