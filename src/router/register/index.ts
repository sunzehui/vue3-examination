import { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import register from "./register";
const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

export async function setupRouter(app: App) {
  register(router);
  app.use(router);
}

export default router;
