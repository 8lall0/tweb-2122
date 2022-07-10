import {onCheck} from "./common/check.js";
import {FormRegistration} from "./form/formRegistration.js";

onCheck({
    onLogged: () => window.location.replace('/'),
    onError: () => {
        const element = document.getElementById('register')
        const form = element.querySelector('form')

        new FormRegistration({
            form: form
        })
    }
})