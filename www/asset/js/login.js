import {FormLogin} from "./form/formLogin.js";
import {onCheck} from "./common/check.js";

onCheck({
    onLogged: () => window.location.replace('/'),
    onError: () => {
        new FormLogin({
            form: document.querySelector('#login').querySelector('form')
        })
    }
})