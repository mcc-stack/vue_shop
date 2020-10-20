import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () =>
          import(/* webpackChunkName: "welcom" */ '../views/Welcome.vue')
      },
      {
        path: '/users',
        component: () =>
          import(
            /* webpackChunkName: "users" */ '../components/users/Users.vue'
          )
      },
      {
        path: '/rights',
        component: () =>
          import(
            /* webpackChunkName: "rights" */ '../components/power/Rights.vue'
          )
      },
      {
        path: '/roles',
        component: () =>
          import(
            /* webpackChunkName: "roles" */ '../components/power/Roles.vue'
          )
      },
      {
        path: '/categories',
        component: () =>
          import(
            /* webpackChunkName: "categories" */ '../components/goods/Categories.vue'
          )
      },
      {
        path: '/params',
        component: () =>
          import(
            /* webpackChunkName: "params" */ '../components/goods/Params.vue'
          )
      },
      {
        path: '/goods',
        component: () =>
          import(/* webpackChunkName: "goods" */ '../components/goods/List.vue')
      },
      {
        path: '/goods/add',
        component: () =>
          import(
            /* webpackChunkName: "goods_add" */ '../components/goods/Add.vue'
          )
      },
      {
        path: '/orders',
        component: () =>
          import(
            /* webpackChunkName: "orders" */ '../components/order/Order.vue'
          )
      },
      {
        path: '/reports',
        component: () =>
          import(
            /* webpackChunkName: "reports" */ '../components/report/Report.vue'
          )
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  //  next() next('/login') 强制跳转

  if (to.path === '/login') return next();
  // 获取token
  if (!window.sessionStorage.getItem('token')) {
    return next('/login');
  }
  next();
});

export default router;
