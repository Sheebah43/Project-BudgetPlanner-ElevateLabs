import { createApp } from "vue";
import router from "./router.js";
import App from "./views/Dashboard.vue"; // Root renders via router-view inside Dashboard, but we’ll mount globally
import "./styles.css";

// Build the app shell with router-view so Login/Dashboard can render
const Root = {
  template: `
    <div class="container">
      <router-view />
    </div>
  `
};

createApp(Root).use(router).mount("#app");
