import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import api from '@/api'
import Comment from 'com/pub/Comment'
import Login from 'com/Login'
import Sche from 'com/sche/Main'
import Inbox from 'com/inbox/Main'
import TodoNew from 'com/sche/TodoNew'
import TodoEdit from 'com/sche/TodoEdit'
import TodoEditSubtodo from 'com/pub/TodoEditSubtodo'
import TodoEditTime from 'com/pub/TodoEditTime'
import TodoEditAlert from 'com/pub/TodoEditAlert'
import TodoEditDate from 'com/pub/TodoEditDate'
import TodoEditRepeat from 'com/pub/TodoEditRepeat'
import Me from 'com/me/Main'
import Kefu from 'com/me/Kefu'
import Note from 'com/pub/Note'
import Explain from 'com/pub/Explain'
import SubtodoList from 'com/pub/SubtodoList'
// import NoPermission from 'com/pub/NoPermission'
import CheckFailure from 'com/pub/CheckFailure'
import PcEnd from 'com/me/PcEnd'
import PlanList from 'com/plan/PlanList'
import PlanNameEdit from 'com/plan/PlanNameEdit'
import PlanNew from 'com/plan/PlanNew'
import ChildPlan from 'com/plan/ChildPlan'
import PlanSetting from 'com/plan/PlanSetting'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/sche'
    },
    //  --------收纳箱相关页面--------
    //  收纳箱主页
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
      meta: {requireAuth: true}
    },
    //  ------------------------
    //  --------日程相关页面--------
    //  日程主页
    {
      path: '/sche',
      name: 'sche',
      component: Sche,
      meta: {requireAuth: true},
      beforeEnter: (to, from, next) => {
        // window.rsqadmg.exec('removeItem', store.state.env.version)
        window.rsqadmg.exec('getItem', {
          name: store.state.env.version.name,
          success (p) {
            var localVersion = Number(p.value)
            var currentVersion = Number(window.rsqConfig.version)
            //  副版本更新时才显示
            if (isNaN(localVersion) || currentVersion - localVersion >= 1000) {
              //  显示引导页
              store.commit('SYS_GUIDE_SHOW')
            }
            next()
          }
        })
      }
    },
    //  创建日程的页面
    {
      //  todoType用来表示是收纳箱新建todo还是日程新建todo，"inbox" or "schedule"
      // path: '/todo/new/:todoType',
      path: '/sche/create',
      name: 'todoNew',
      component: TodoNew,
      meta: {requireAuth: true}
    },
    //  todo详情页面
    {
      path: '/todo/:todoId',
      name: 'todoEdit',
      component: TodoEdit,
      meta: {requireAuth: true}
    },
    //  todo的子任务列表页面
    {
      path: '/todo/:todoId/subtodo',
      name: 'subtodoList',
      component: SubtodoList,
      meta: {requireAuth: true}
    },
    //  todo的子任务的详情页面
    {
      path: '/todo/:todoId/subtodo/:subtodoId',
      name: 'todoEditSubtodo',
      component: TodoEditSubtodo,
      meta: {requireAuth: true}
    },
    //  todo的日期页面，用于新增或者编辑日程时候的日期设置
    {
      path: '/todo/date',
      name: 'todoEditDate',
      component: TodoEditDate,
      meta: {requireAuth: false}
    },
    //  todo的日期重复页面，用于新增或者编辑日程时候的日期重复设置
    {
      path: '/todo/repeat',
      name: 'todoEditRepeat',
      component: TodoEditRepeat,
      meta: {requireAuth: false}
    },
    //  todo的时间编辑页面，用于新增或者编辑日程时候的时间设置
    {
      path: '/todo/time',
      name: 'todoEditTime',
      component: TodoEditTime,
      meta: {requireAuth: false}
    },
    //  todo的时间提醒编辑页面，用于新增或者编辑日程时候的时间提醒设置
    {
      path: '/todo/alert',
      name: 'todoEditAlert',
      component: TodoEditAlert,
      meta: {requireAuth: false}
    },
    //  日程评论页面
    {
      path: '/todo/comment',
      name: 'comment',
      component: Comment,
      meta: {requireAuth: true}
    },
    //  日程备注页面
    {
      path: '/todo/note',
      name: 'note',
      component: Note,
      meta: {requireAuth: true}
    },
    //  ------------------------

    //  --------计划页面--------
    //  新建plan的页面
    {
      path: '/plan/create',
      name: 'planNew',
      component: PlanNew,
      meta: {requireAuth: true}
    },
    //  plan列表页面
    {
      path: '/plan/list',
      name: 'PlanList',
      component: PlanList,
      meta: {requireAuth: true}
    },
    //  计划详情页面
    {
      path: '/plan/:planId/child-plan',
      name: 'childPlan',
      component: ChildPlan,
      meta: {requireAuth: true}
    },
    //  计划设置页面
    {
      path: '/plan/:planId/plan-setting',
      name: 'planSetting',
      component: PlanSetting,
      meta: {requireAuth: true}
    },
    //  编辑plan名称的页面
    {
      path: '/plan/:planId/edit-name',
      name: 'planNameEdit',
      component: PlanNameEdit,
      meta: {requireAuth: true}
    },
    //  ------------------------

    //  --------个人信息--------
    //  个人信息
    {
      path: '/me/pc-end',
      name: 'pcEnd',
      component: PcEnd,
      meta: {requireAuth: true}
    },
    //  客服页面
    {
      path: '/me/kefu',
      name: 'kefu',
      component: Kefu,
      meta: {requireAuth: true}
    },
    //  无权查看的跳转页面
    {
      path: '/pub/check-failure',
      name: 'checkFailure',
      component: CheckFailure,
      meta: {requireAuth: true}
    },
    //  产品介绍页面
    {
      path: '/pub/explain',
      name: 'explain',
      component: Explain,
      meta: {requireAuth: true}
    },
    {
      path: '/me',
      name: 'me',
      component: Me,
      meta: {requireAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
    //  ------------------------

    // {
    //   path: 'com/plan/taskMember',
    //   name: 'taskMember',
    //   component: taskMember,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/plan/createSubplan',
    //   name: 'createSubplan',
    //   component: createSubplan,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/plan/Plan',
    //   name: 'Plan',
    //   component: Plan,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/demo/test',
    //   name: 'test',
    //   component: test,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/MemberEdit',
    //   name: 'MemberEdit',
    //   component: MemberEdit,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/MemberList',
    //   name: 'MemberList',
    //   component: MemberList,
    //   meta: {requireAuth: true}
    // },
    // {
    //   path: '/pub/RemindWindow',
    //   name: 'RemindWindow',
    //   component: RemindWindow,
    //   meta: {requireAuth: true}
    // },
  ]
})

/**
 * 在路由切换时判断切换到的页面是否需要权限验证
 * 如果需要权限验证，那么就判断用户信息是否存在，如果不存在，就读取用户信息
 */
router.beforeEach((to, from, next) => {
  store.state.env.isShowNav = false
  store.state.sys.currentPath = to.path

  if (!to.matched.some(record => record.meta.requireAuth)) {
    return next()
  }
  var currentUser = store.state.loginUser
  if (currentUser == null || currentUser.rsqUser == null) {
    currentUser = currentUser || {}
    api.system.checkAuth()
      .then((res) => {
        if (res.id) {
          currentUser.rsqUser = res
          store.state.loginUser = currentUser
          next()
        } else {
          next('/login')
        }
      })
  } else {
    window.rsqadmg.log('login user found')
    next()
  }
})

export default router
