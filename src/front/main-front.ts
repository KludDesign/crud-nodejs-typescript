import Vue from "vue"
import App from "./App.vue"
import Buefy from "buefy"
import Axios from "axios"

// Axios must not raise an error with this status code
Axios.defaults.validateStatus = (status: number): boolean => {
    return (status >= 200 && status <= 400);
}

Vue.use(Buefy);

const app = new Vue({

    el: "#app",

    render(h) {
        return h(App);
    }

});