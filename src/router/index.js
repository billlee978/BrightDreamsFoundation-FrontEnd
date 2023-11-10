import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index.vue'),
    hidden: true,
    meta: {
      title: '儿童注册',
      icon: 'el-icon-user'
    }
  },
  {
    path: '/personal',
    component: () => import('@/views/personal/index.vue'),
    meta: {
      title: '儿童个人中心',
      icon: 'el-icon-user',
      hidden: true
    }
  },
  {
    path: '/mainpage',
    component: () => import('@/views/mainpage/mainpage.vue'),
    meta: {
      title: '儿童主页面',
      icon: 'el-icon-user',
      hidden: true
    }
  },
  {
    path: '/task',
    component: () => import('@/views//task/list'), // 使用Layout组件作为包裹
    meta: {
      title: '任务列表',
      icon: 'child'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/task/list.vue'),
        meta: {
          title: '任务列表',
          icon: 'child'
        }
      }
    ]
  },
  {
    path: '/already',
    component: () => import('@/views/task/already.vue'),
    meta: {
      title: '任务列表（已完成）',
      icon: 'el-icon-user',
      hidden: true
    }
  },
  {
    path: '/several',
    component: () => import('@/views/task/several.vue'),
    meta: {
      title: '任务处理情况',
      icon: 'el-icon-user',
      hidden: true
    }
  },
  {
    path: '/submitHomework',
    component: () => import('@/views/tasks/submitHomework'),
    meta: {
      title: '作业提交',
      icon: 'el-icon-edit-outline'
    }
  },
  {
    path: '/checkSubmission',
    component: () => import('@/views/tasks/checkSubmission.vue'),
    meta: {
      title: '查看作业提交状况',
      icon: 'el-icon-document-checked'
    }
  },
  {
    path: '/market',
    component: () => import('@/views/awardMarket/market.vue'),
    meta: {
      title: '积分商城',
      icon: 'el-icon-document-checked'
    }
  },
  // {
  //   path: '/detail',
  //   component: Layout, // 使用Layout组件作为包裹
  //   redirect: 'task-detail', // 可能需要一个默认的子路由
  //   meta: {
  //     title: '任务详情',
  //     icon: 'child'
  //   },
  //   children: [
  //     {
  //       path: 'task-detail',
  //       component: () => import('@/views/task/detail.vue'),
  //       meta: {
  //         title: '任务详情',
  //         icon: 'child'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/detail',
    component: () => import('@/views/task/detail.vue'),
    meta: {
      title: '任务详情',
      icon: 'child'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/user',
    component: Layout,
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-tools'
    },
    alwaysShow: true,
    children: [
      {
        path: 'total',
        component: () => import('@/views/user/index'),
        meta: {
          title: '总管理',
          icon: 'el-icon-user'
        }
      },
      {
        path: 'children',
        component: () => import('@/views/user/child'),
        meta: {
          title: '儿童管理',
          icon: 'child'
        }
      },
      {
        path: 'volunteer',
        component: () => import('@/views/user/volunteer'),
        meta: {
          title: '志愿者管理',
          icon: 'volunteer'
        }
      },
      {
        path: 'donator',
        component: () => import('@/views/user/donator'),
        meta: {
          title: '捐赠者管理',
          icon: 'donator'
        }
      }
    ]
  },

  {
    path: '/donation',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'donation',
        component: () => import('@/views/donation/index'),
        meta: { title: '捐赠流水', icon: 'form' }
      }
    ]
  },

  {
    path: '/mission',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'mission',
        component: () => import('@/views/mission/index'),
        meta: { title: '任务管理', icon: 'el-icon-s-order' }
      }
    ]
  },

  {
    path: '/good',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'good',
        component: () => import('@/views/good/index'),
        meta: { title: '商品管理', icon: 'el-icon-s-goods' }
      }
    ]
  },

  {
    path: '/data',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'data',
        component: () => import('@/views/data/index'),
        meta: { title: '数据中控', icon: 'dashboard' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
