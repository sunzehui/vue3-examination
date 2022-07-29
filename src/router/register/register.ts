import {Router, RouteRecordRaw, RouteRecordNormalized} from "vue-router";
import {useUserStore} from "@/store/user";
import {ElMessage} from "element-plus";

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
        if (isAuthenticated && to.name === 'login') {
            // next({name: 'home'})
        }
        if (!isAuthenticated && !thisRoutePublic) {
            ElMessage.error("请先登录");
            next({name: "login"});
        } else next();
    });
}

export default (router: Router) => {
    let routes = autoloadModuleRoutes().map((route) => {
        //根据权限过滤
        return route;
    });
    //过滤掉children为空的路由
    routes = routes.filter((r) => r.children?.length);
    authGuard(router);
    routes.forEach((r) => router.addRoute(r as RouteRecordRaw));
};
