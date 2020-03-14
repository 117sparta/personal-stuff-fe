import Vue from 'vue';
import VueRouter from 'vue-router';
import CommonRoutes from './common';
import beforeEachHooks from './beforeEach';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: CommonRoutes
});

router.beforeEach(beforeEachHooks);

export default router;
