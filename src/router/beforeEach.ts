export default function beforeEachHooks (to, from, next) {
  console.log(to.fullPath);
  if (to.fullPath === '/') next({ path: '/home' });
  else next();
}
