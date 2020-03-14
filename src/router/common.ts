export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home')
  },
  {
    path: '/404',
    name: 'Not-found',
    component: () => import('@/views/error-page/404'),
    replace: true
  },
  {
    path: '/403',
    name: 'Unauthorized',
    component: () => import('@/views/error-page/403'),
    replace: true
  }
];
