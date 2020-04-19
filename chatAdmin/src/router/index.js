import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
/* import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested' */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  },
  {
    path: "/room",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/room/index"),
        name: "Room",
        meta: { title: "房间管理", icon: "table" }
      }
    ]
  },
  {
    path: "/addressBook",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/addressBook/index"),
        name: "AddressBook",
        meta: { title: "通讯录管理", icon: "message" }
      }
    ]
  },
  {
    path: "/users",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/users/index"),
        name: "Users",
        meta: { title: "用户管理", icon: "people" }
      }
    ]
  },
  {
    path: "/admin",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/admin/index"),
        name: "Admin",
        meta: { title: "管理员管理", icon: "peoples" }
      }
    ]
  },
  {
    path: "/log",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/log/index"),
        name: "Log",
        meta: { title: "日志管理", icon: "edit" }
      }
    ]
  },
  {
    path: "/config",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/config/index"),
        name: "Config",
        meta: { title: "系统配置管理", icon: "nested" }
      }
    ]
  },
  {
    path: "/constConfig",
    component: Layout,
    children: [
      {
        path: "index",
        component: () => import("@/views/constConfig/index"),
        name: "constConfig",
        meta: { title: "常量配置管理", icon: "nested" }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
