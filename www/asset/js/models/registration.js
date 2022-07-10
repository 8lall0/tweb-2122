class Registration {
    constructor(config) {
        config.form.addEventListener('submit', (e) => {
            e.preventDefault()
            try {
                fetch(e.currentTarget.action, {
                    method: e.currentTarget.method,
                    body: new FormData(e.currentTarget),
                }).then(response => {
                    if (response.status === 200) {
                        config.onRegistration(response.json())
                    } else {
                        config.onNotValid(response.json(), response.status)
                    }
                })
            } catch (error) {
                config.onError(error)
            }
        })
    }
}

export {Registration}