export default function beforeEachHooks (to, from, next) {
  if (to.fullPath === '/') next({ path: '/home' });
  else next();
}
