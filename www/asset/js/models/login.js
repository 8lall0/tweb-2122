import {status} from "../common/status.js";

class Login {
    constructor(conf) {
        this._form = conf.form
        this._onLoginCb = conf.onLogin
        this._onErrorCb = conf.onError

        this._form.addEventListener('submit', (e) => {
            e.preventDefault()
            try {
                fetch(e.currentTarget.action, {
                    method: e.currentTarget.method,
                    body: new FormData(e.currentTarget),
                }).then(status)
                    .then(response => {
                    if (response.status === 200) {
                        this._onLoginCb(response.json())
                    } else {
                        this._onErrorCb(response)
                    }
                })
            } catch (error) {
                this._onErrorCb(error)
            }
        })
    }
}

export {Login}
