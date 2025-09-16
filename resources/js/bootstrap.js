import axios from "axios";
import { configureEcho } from "@laravel/echo-react";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const echo = configureEcho({
    broadcaster: "pusher",
    forceTLS: true,
    auth: {
        headers: {
            "X-CSRF-TOKEN": document
                .querySelector("meta[name='csrf-token']")
                .getAttribute("content"), // CSRF token
        },
    },
});
