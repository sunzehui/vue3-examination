import { Router, RouteRecordRaw, RouteRecordNormalized } from "vue-router";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";
import page404 from "@/views/exam-paper/index.vue";
//注册路由
function autoloadModuleRoutes(): RouteRecordNormalized[] {
  const routes = [] as RouteRecordNormalized[];
  register(routes, import.meta.globEager("../*.ts"));

  return routes;
}

//绑定路由
function register(
  routes: RouteRecordNormalized[],
  modules: Record<string, any>
) {
  Object.keys(modules).forEach((key) => {
    routes.push(modules[key].default);
  });
}

function authGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const thisRoutePublic = to.meta.publicRoute || false;
    const userStore = useUserStore();

    const isAuthenticated = userStore.isAuthenticated;
    if (isAuthenticated && to.name === "login") {
      // next({name: 'home'})
    }
    if (!isAuthenticated && !thisRoutePublic) {
      ElMessage.error("请先登录");
      next({ name: "login" });
    } else next();
  });
}

export default (router: Router) => {
  let routes = autoloadModuleRoutes();
  authGuard(router);
  routes.forEach((r) => router.addRoute(r as RouteRecordRaw));
  router.addRoute({
    path: "/:catchAll(.*)",
    redirect: "/404",
  });
};
