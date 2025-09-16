import { configureEcho } from "@laravel/echo-react";
import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.headers.common["'X-CSRF-TOKEN'"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

// expose for debugging
window.Pusher = Pusher;

configureEcho({
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
