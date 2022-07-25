import { Router, RouteRecordRaw, RouteRecordNormalized } from "vue-router";

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

export default (router: Router) => {
  let routes = autoloadModuleRoutes().map((route) => {
    //根据权限过滤
    return route;
  });
  //过滤掉children为空的路由
  routes = routes.filter((r) => r.children?.length);
  routes.forEach((r) => router.addRoute(r as RouteRecordRaw));
};
