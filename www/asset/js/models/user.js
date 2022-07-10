import {status} from "../common/status.js";

class User {
    constructor(conf) {
        this._id = conf.id ?? null
        this._blocked = conf.blocked ?? null
        this._role = conf.role ?? null

        this._onPostCb = conf.onPost
        this._onErrorCb = conf.onError

        const reqBody = new FormData()
        reqBody.append('id', this._id)

        if (this._blocked !== null) {
            reqBody.append('blocked', this._blocked)
        }

        if (this._role !== null) {
            reqBody.append('role', this._role)
        }

        try {
            fetch('/api/user', {
                method: 'PATCH',
                body: reqBody,
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

export {User}