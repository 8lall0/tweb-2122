import {AbstractForm} from "./abstractForm.js";

class FormComment extends AbstractForm {
    constructor(conf) {
        super();
        this._form = conf.form

        this._fields = {
            content: false,
        }

        this._proxy = this._setupProxy()

        const fields = {
            content: this._form.querySelector('[name=content]'),
        }

        fields.content.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (val.length === 0) {
                this._proxy.content = false;
                this._removeErrorFromField(e.currentTarget)
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.content = true;
            }
        })

        const errorContainer = this._form.querySelector('.form__error')
    }


}

export {FormComment}