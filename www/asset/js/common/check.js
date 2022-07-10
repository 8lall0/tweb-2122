import {status} from "./status.js";

const onCheck = (conf) => {
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
            conf.onLogged(response)
        }).catch(response => {
        document.body.classList.remove('logged')
        document.body.classList.add('not-logged')
        document.querySelectorAll('.show-if-not-logged').forEach(el => {
            el.classList.remove('hidden')
        })
        conf.onError(response)
    })
}


export {onCheck}