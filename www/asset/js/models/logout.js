class Logout {
    constructor() {
        this._onLogoutCb = null;
    }

    logout() {
        fetch('/api/logout', {
            method: 'POST',
        }).then(response => {
            if (response.status === 200) {
                this._onLogoutCb()
            }
        })
    }

    onLogout(fn) {
        this._onLogoutCb = fn
    }
}

export {Logout}