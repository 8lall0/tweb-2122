import {onCheck} from "../../common/check.js";
import {UserListRetriever} from "../../models/retriever/userListRetriever.js";
import {User} from "../../models/user.js";

onCheck({
    onLogged: (response) => {
        if (!response.isAdmin) {
            window.location.replace('/')
            return
        }

        const userId = response.id

        const toggleBlock = (id, blocked, cb) => {
            new User({
                id: id,
                blocked: blocked,
                onPost: cb
            })
        }

        const setRole = (id, role, cb) => {
            new User({
                id: id,
                role: role,
                onPost: cb
            })
        }

        new UserListRetriever({
            onLoad: response => {
                const el = document.querySelector('main')

                const ul = document.createElement('ul')
                ul.classList.add('userlist')

                for (let u of response) {
                    const li = document.createElement('li')
                    const span = document.createElement('span')
                    span.textContent = u.username


                    li.appendChild(span)

                    if (u.id !== userId) {
                        const roleBtn = document.createElement('button')
                        roleBtn.textContent = u.role === 0 ? 'Rimuovi admin' : 'Rendi admin'
                        roleBtn.classList.add('btn')
                        roleBtn.dataset.value = u.role
                        roleBtn.addEventListener('click', (e) => {
                            const val = parseInt(roleBtn.dataset.value)
                            setRole(u.id, val === 0 ? 1 : 0, () => {
                                roleBtn.textContent = val === 1 ? 'Rimuovi admin' : 'Rendi admin'
                                roleBtn.dataset.value = ((val+1) % 2).toString()
                            })
                        })
                        const blockBtn = document.createElement('button')
                        blockBtn.textContent = u.blocked === 0 ? 'Blocca' : 'Sblocca'
                        blockBtn.dataset.value = u.blocked
                        blockBtn.classList.add('btn')
                        blockBtn.addEventListener('click', (e) => {
                            const val = parseInt(blockBtn.dataset.value)
                            toggleBlock(u.id, val === 0 ? 1 : 0, () => {
                                blockBtn.textContent = val === 1 ? 'Blocca' : 'Sblocca'
                                blockBtn.dataset.value = ((val+1) % 2).toString()
                            })
                        })

                        li.append(roleBtn, blockBtn)
                    }

                    ul.appendChild(li)
                }
                el.appendChild(ul)
            }
        })
    }
})