import {Post} from "../../models/post.js";
import {QueryParams} from "../../common/queryParams.js";
import {onCheck} from "../../common/check.js";
import {PostRetriever} from "../../models/retriever/postRetriever.js";

onCheck({
    onLogged: () => {
        const form = document.querySelector('#edit-post')

        if (!QueryParams.id) {
            window.location.replace('/')
            return
        }

        form.querySelector('[name=id]').value = QueryParams.id

        new PostRetriever({
            id: QueryParams.id,
            onLoad: (response) => {
                form.querySelector('[name=title]').value = response.title
                form.querySelector('[name=content]').value = response.content

            }
        })
        new Post({
            form: form,
            overrideMethod: 'patch',
            onPost: (response) => {
                window.location.replace(`/post?id=${response.id}`);
            },
        })
    },
    onError: () => {}//window.location.replace('/'),
})