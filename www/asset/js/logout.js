import {Logout} from "./models/logout.js";

const logout = new Logout()

logout.onLogout(() => {
    window.location.replace('/');
})
logout.logout()