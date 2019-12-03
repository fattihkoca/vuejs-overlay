import Overlay from "./Overlay.vue";

const install = Vue => {
    Vue.component("overlay", Overlay);
};

export default {
    install
};

export {Overlay};