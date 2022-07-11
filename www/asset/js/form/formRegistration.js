import {AbstractForm} from "./abstractForm.js";
import {Registration} from "../models/registration.js";

class FormRegistration extends AbstractForm {
    constructor(conf) {
        super();
        this._form = conf.form

        this._fields = {
            username: false,
            password: false,
            passwordRepeat: false
        }

        this._proxy = this._setupProxy()

        const fields = {
            username: this._form.querySelector('input[name=username]'),
            password: this._form.querySelector('input[name=password]'),
            passwordRepeat: this._form.querySelector('input[name=password_repeat]'),
        }

        function isValid(str) {
            const pattern = /[^\w]|_/g
            return !(pattern.test(str));
        }

        fields.username.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (!isValid(val)) {
                this._writeErrorToField(e.currentTarget, 'Username non valido')
                this._proxy.username = false;
            } else if (val.length <= 3 && val.length > 1) {
                this._writeErrorToField(e.currentTarget, 'Username troppo corto')
                this._proxy.username = false;
            } else if (val.length === 0) {
                this._proxy.username = false;
                this._removeErrorFromField(e.currentTarget)
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.username = true;
            }
        })

        fields.password.addEventListener('blur', e => {
            const val = e.currentTarget.value
            if (val.length <= 3 && val.length > 1) {
                this._writeErrorToField(e.currentTarget, 'Password troppo corta')
                this._proxy.password = false;
            } else if (val.length === 0) {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.password = false;
                fields.passwordRepeat.focus()
                fields.passwordRepeat.blur()
            } else {
                fields.passwordRepeat.focus()
                fields.passwordRepeat.blur()
                this._removeErrorFromField(e.currentTarget)
                this._proxy.password = true;
            }
        })

        fields.passwordRepeat.addEventListener('blur', e => {
            const val = e.currentTarget.value
            const pwd = fields.password.value

            if (val.length > 1 && val !== pwd) {
                this._writeErrorToField(e.currentTarget, 'Le password non coincidono')
                this._proxy.passwordRepeat = false;
            } else if (val.length === 0) {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.passwordRepeat = false;
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.passwordRepeat = true;
            }
        })

        new Registration({
            form: this._form,
            onRegistration: () => {
                window.location.replace('/');
            },
            onNotValid: (response, status) => {
                this._form.classList.add('error')
                if (status === 409) {
                    this._writeErrorToField(fields.username, 'Username già esistente')
                } else {
                    this._writeErrorToForm('Si è verificato un errore')
                }
            },
            onError: () => {
                this._form.classList.add('error')
                this._writeErrorToForm('Si è verificato un errore')
            }
        })
    }
}

export {FormRegistration}