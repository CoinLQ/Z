import Vue from 'vue';
import iView from 'iview';
import Util from '@/libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import store from '@/store';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    base: '',
    routes: routers
};


export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('token') && !(to.name === 'login' || to.name === 'signup' || to.name === 'resetpasswd'|| to.name === 'ie-403' || to.name === 'activate')) { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
            
        } else if (Cookies.get('token') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
                if (store.getters.is_admin || Util.includedThisRoute(to.fullPath, '', store.getters.menus)) {
                        Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                }
                else {
                    next({
                        replace: true,
                        name: 'error-403'
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.setCurrentPath(router.app, to.name);
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});