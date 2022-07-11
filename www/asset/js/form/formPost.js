import {AbstractForm} from "./abstractForm.js";
import {Post} from "../models/post.js";
import {PostRetriever} from "../models/retriever/postRetriever.js";

class FormPost extends AbstractForm {
    constructor(conf) {
        super();
        this._form = conf.form ?? null
        this._postId = conf.postId ?? null
        this._isEdit = conf.isEdit ?? false

        this._fields = {
            title: false,
            content: false,
        }

        this._proxy = this._setupProxy()

        const fields = {
            title: this._form.querySelector('[name=title]'),
            content: this._form.querySelector('[name=content]'),
        }

        fields.content.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (val.length < 15 && val.length > 0) {
                this._proxy.content = false;
                this._writeErrorToField(e.currentTarget, 'Post troppo corto')
            } else if (val.length === 0) {
                this._proxy.content = false;
                this._removeErrorFromField(e.currentTarget)
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.content = true;
            }
        })

        fields.title.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (val.length < 5 && val.length > 0) {
                this._proxy.title = false;
                this._writeErrorToField(e.currentTarget, 'Titolo troppo corto')
            } else if (val.length === 0) {
                this._proxy.title = false;
                this._removeErrorFromField(e.currentTarget)
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.title = true;
            }
        })

        if (this._isEdit) {
            new PostRetriever({
                id: this._postId,
                onLoad: (response) => {
                    this._form.querySelector('[name=title]').value = response.title
                    this._form.querySelector('[name=content]').value = response.content
                    this._form.querySelector('[name=id]').value = this._postId

                    fields.title.focus()
                    fields.title.blur()
                    fields.content.focus()
                    fields.content.blur()
                }
            })
        }

        new Post({
            form: this._form,
            overrideMethod: this._isEdit ? 'patch' : null,
            onPost: (response) => {
                window.location.replace(`/?id=${response.id}`);
            },
            onError: () => {
                this._form.classList.add('error')
                this._writeErrorToForm('Si è verificato un errore')
            }
        })
    }
}

export {FormPost}