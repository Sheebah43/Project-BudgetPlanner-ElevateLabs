import { createRouter, createWebHistory } from "vue-router";
import { auth } from "./firebase.js";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/", component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
  const user = auth.currentUser;
  if (requiresAuth && !user) next("/login");
  else next();
});

export default router;
