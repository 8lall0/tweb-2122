import {AbstractForm} from "./abstractForm.js";
import {Login} from "../models/login.js";

class FormLogin extends AbstractForm {
    constructor(conf) {
        super();
        this._form = conf.form

        this._fields = {
            username: false,
            password: false,
        }

        this._proxy = this._setupProxy()

        const fields = {
            username: this._form.querySelector('input[name=username]'),
            password: this._form.querySelector('input[name=password]'),
        }

        fields.username.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            this._proxy.username = (val.length > 0)
        })

        fields.password.addEventListener('blur', e => {
            const val = e.currentTarget.value
            this._proxy.password = (val.length > 0)
        })

        new Login({
            form: this._form,
            onLogin: () => {
                window.location.replace('/');
            },
            onError: () => {
                this._writeErrorToForm('Errore di login')
            }
        })

    }


}

export {FormLogin}