import {AbstractForm} from "./abstractForm.js";
import {Comment} from "../models/comment.js";
import {CommentRetriever} from "../models/retriever/commentRetriever.js";

class FormComment extends AbstractForm {
    constructor(conf) {
        super();
        this._form = conf.form
        this._postId = conf.postId
        this._isEdit = conf.isEdit ?? false

        this._fields = {
            content: false,
        }

        this._proxy = this._setupProxy()

        const fields = {
            content: this._form.querySelector('[name=content]'),
        }

        fields.content.addEventListener('blur', (e) => {
            const val = e.currentTarget.value
            if (val.length < 5 && val.length > 0) {
                this._proxy.content = false;
                this._writeErrorToField(e.currentTarget, 'Commento troppo corto')
            } else if (val.length === 0) {
                this._proxy.content = false;
                this._removeErrorFromField(e.currentTarget)
            } else {
                this._removeErrorFromField(e.currentTarget)
                this._proxy.content = true;
            }
        })

        new CommentRetriever({
            id: this._postId,
            onLoad: (response) => {
                this._form.querySelector('[name=id]').value = this._postId
                this._form.querySelector('[name=content]').value = response.content
            }
        })

        new Comment({
            form: this._form,
            overrideMethod: this._isEdit ? 'patch' : null,
            onPost: () => {
                window.location.replace(`/post?id=${this._postId}`)
            },
        })
    }
}

export {FormComment}