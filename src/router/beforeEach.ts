import store from '@/store';

export default function beforeEachHooks (to, from, next) {
  const isAuth = store.getters['user/isAuth'];
  console.log(to.fullPath);
  if ((!isAuth && to.meta.needAuth) || (!isAuth && to.fullPath === '/')) {
    next({ path: '/login' }); // 没有登录，跳转到登录页
  } else if ((isAuth && to.fullPath === '/') || (isAuth && to.fullPath === '/login')) {
    next({ path: '/home' });
  } else {
    next();
  }
}
