import {status} from "./status.js";

const onCheck = (conf) => {
    const onError = conf.onError ?? null

    fetch('/api/checkLogin', {
        method: 'GET',
    }).then(status)
        .then(response => response.json())
        .then(response => {
            document.body.classList.add('logged')
            document.body.classList.remove('not-logged')
            document.querySelectorAll('.show-if-logged').forEach(el => {
                el.classList.remove('hidden')
            })

            if (response.isAdmin) {
                document.querySelectorAll('.show-if-admin').forEach(el => {
                    el.classList.remove('hidden')
                })
            }
            conf.onLogged(response)
        }).catch(response => {
        document.body.classList.remove('logged')
        document.body.classList.add('not-logged')
        document.querySelectorAll('.show-if-not-logged').forEach(el => {
            el.classList.remove('hidden')
        })
        if (onError !== null) {
            onError(response)
        } else {
            console.log('reload')
            window.location.replace('/')
        }

    }).finally(() => {
        document.body.classList.add('loaded')
    })
}


export {onCheck}