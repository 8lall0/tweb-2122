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
            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
        }

        fields.username.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (!isValid(val)) {
                this._writeErrorToField(e.currentTarget, 'testo non valido')
                this._proxy.username = false;
            } else if (val.length <= 3 && val.length > 1) {
                this._writeErrorToField(e.currentTarget, 'testo troppo corto')
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
                this._writeErrorToField(e.currentTarget, 'password troppo corta')
                this._proxy.password = false;
            } else if (val.length === 0) {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.password = false;
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.password = true;
            }
        })

        fields.passwordRepeat.addEventListener('blur', e => {
            const val = e.currentTarget.value
            const pwd = fields.password.value

            if (val.length > 1 && val !== pwd || val.length === 0) {
                this._writeErrorToField(e.currentTarget, 'Le password non coincidono')
                this._proxy.passwordRepeat = false;
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.passwordRepeat = true;
            }
        })

        const errorContainer = this._form.querySelector('.form__error')

        new Registration({
            form: this._form,
            onRegistration: () => {
                window.location.replace('/');
            },
            onNotValid: (response, status) => {
                this._form.classList.add('error')
                if (status === 409) {
                    this._writeErrorToField(fields.username, 'Username già esistente')
                } else if (status === 406) {
                    // TODO ritorna 406 se password non valida, o analizza errore in ritorno per vedere se usrname o pwd non validi
                    this._writeErrorToField(fields.password, 'Password non valida')
                } else {
                    errorContainer.textContent = 'Si è verificato un errore'
                }
            },
            onError: () => {
                this._form.classList.add('error')
                errorContainer.textContent = 'Si è verificato un errore'
            }
        })
    }


}

export {FormRegistration}