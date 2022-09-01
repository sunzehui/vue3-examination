import { Router, RouteRecordRaw, RouteRecordNormalized } from "vue-router";
import { useUserStore } from "@/store/user";
import { ElMessage } from "element-plus";
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
function setTitle(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 修改页面title
    const reg = new RegExp(/^(.+)(\s\|\s.+)$/);
    const appTitle = import.meta.env.VITE_APP_TITLE;

    document.title = !to.meta.title
      ? appTitle
      : appTitle.match(reg)
      ? appTitle.replace(reg, `${to.meta.title}$2`)
      : `${to.meta.title} | ${appTitle}`;
    next();
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
  setTitle(router);
  routes.forEach((r) => router.addRoute(r as RouteRecordRaw));
  router.addRoute({
    path: "/:catchAll(.*)",
    redirect: "/404",
  });
};
