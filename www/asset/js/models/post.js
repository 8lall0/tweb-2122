import {status} from "../common/status.js";

class Post {
    constructor(conf) {
        this._form = conf.form;
        this._ovverrideMethd = conf.overrideMethod ? conf.overrideMethod.toUpperCase() : null
        this._onPostCb = conf.onPost ?? null
        this._onErrorCb = conf.onError ?? null

        this._form.addEventListener('submit', (e) => {
            e.preventDefault()

            try {
                fetch(e.currentTarget.action, {
                    method: this._ovverrideMethd ?? e.currentTarget.method,
                    body: new FormData(e.currentTarget),
                }).then(status)
                    .then(response => response.json())
                    .then(response => {
                        if (this._onPostCb !== null) {
                            this._onPostCb(response)
                        }
                    })
            } catch (error) {
                if (this._onErrorCb !== null) {
                    this._onErrorCb(error)
                }
            }
        })
    }
}

export {Post}