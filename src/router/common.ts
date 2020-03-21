export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    children: [
      {
        path: '/home/board',
        name: 'home-board',
        component: () => import('@/views/home/home-board'),
        meta: {
          title: '我的看板'
        }
      },
      {
        path: '/home/message-box',
        name: 'message-box',
        component: () => import('@/views/home/message-box'),
        meta: {
          title: '消息页面'
        }
      }
    ]
  },
  {
    path: '/board/:boardId',
    name: 'board',
    component: () => import('@/views/board'),
    meta: {
      title: '看板页面'
    }
  },
  {
    path: '/404',
    name: 'Not-found',
    component: () => import('@/views/error-page/404'),
    meta: {
      title: 'Not Found'
    },
    replace: true
  },
  {
    path: '/403',
    name: 'Unauthorized',
    component: () => import('@/views/error-page/403'),
    meta: {
      title: 'Unauthorized'
    },
    replace: true
  }
];
