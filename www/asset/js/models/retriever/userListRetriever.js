import {status} from "../../common/status.js";

class UserListRetriever {
    constructor(conf) {
        try {
            fetch('/api/users', {
                method: 'GET'
            }).then(status)
                .then(response => response.json())
                .then(response => {
                    conf.onLoad(response)
                })
        } catch (error) {
            console.log(error.message, 'error');
        }
    }
}

export {UserListRetriever}