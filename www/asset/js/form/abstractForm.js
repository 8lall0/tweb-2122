class AbstractForm {
    constructor() {
        this._form = null;
        this._fields = null;
    }

    _setupProxy() {
        const handler = {
            get: (target, key) => {
                if(typeof target[key] === "object" && target[key] !== null) {
                    return new Proxy(target[key], handler)
                }

                return target[key]
            },
            set: (target, prop, value) => {
                target[prop] = value
                let flag = true;
                for (const key in target) {
                    flag = flag && target[key]
                }
                this._setDisabled(flag)
                return true
            }
        }

        return new Proxy(this._fields, handler)
    }

    _writeErrorToField(element, msg) {
        const el = this._form.querySelector(`span[data-for=${element.id}]`)
        if (!el) {
            const span = document.createElement('span')
            span.textContent = msg
            span.dataset.for = element.id
            element.after(span)
        } else {
            el.textContent = msg
        }
        element.classList.add('error')
    }

    _removeErrorFromField(element) {
        const el = this._form.querySelector(`span[data-for=${element.id}]`)
        if (el) {
            element.classList.remove('error')
            el.remove()
        }
    }

    _setDisabled(flag) {
        this._form.querySelector('button[type=submit]').disabled = !flag
    }
}

export {AbstractForm}