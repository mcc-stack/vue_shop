import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home';
import Welcome from '../views/Welcome';
import Users from '../components/users/Users';
import Rights from '../components/power/Rights';
import Roles from '../components/power/Roles';
import Categories from '../components/goods/Categories';
import Params from '../components/goods/Params';

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', component: Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Categories},
      {path:'/params',component:Params}
    ]
}
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  //  next() next('/login') 强制跳转

  if(to.path === '/login') return next()
  // 获取token
  if(!window.sessionStorage.getItem('token')){
    return next('/login')
  }
  next()
})

export default router
