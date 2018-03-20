import {routers, otherRouter, appRouter} from '@/router/router';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
import env from '@/config/env';
import _ from 'lodash';

const app = {
    state: {
        cachePage: [],
        menus: [],
        is_admin: env === 'development', //如果是admin用户就true，打开所有菜单过滤
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [{
                title: '首页',
                path: '',
                name: 'home_index'
        }], // 面包屑数组
        menuList: [],
        openMenuPaths: ['/help'],
        disableMenuPaths: ['/mytask', '/jiaodui'],
        routers: [
            ...routers
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    getters: {
        menus: state => {
            return state.menus;
        },
        is_admin: state => {
            return state.is_admin;
        },
    },
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (_.includes(state.disableMenuPaths, item.path)) {
                    return false;
                }
                let _item = _.cloneDeep(item)
                let childrenArr = _item.children.filter(child => {
                    if (state.is_admin || Util.includedThisRoute(item.path, child.path, state.menus)) {
                        return child;
                    } else if (_.includes(state.openMenuPaths, item.path)) {
                        return child;
                    }
                })
                _item.children = childrenArr;

                if (childrenArr.length != 0){
                    let len = menuList.push(_item);
                }

            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setMenus (state, menu) {
            state.menus = menu;
        },
        setAdmin (state, is_admin) {
            state.is_admin = is_admin;
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        refressh_token (state) {
            
            if (state.menus.length == 0) {
                let baseURL = env === 'development' ? 'http://localhost:8000' : '/';
                Util.ajax.post('/auth/auth-token-refresh/', {
                        token: Cookies.get('token'),
                }, { baseURL })
                .then(function (response) {
                    if (response.data.staff.is_active) {
                        let staff = response.data.staff;
                        Cookies.set('token', response.data.token, { expires: 7 });
                        state.menus = staff.menus;
                        state.is_admin = staff.is_admin;
                    } else {
                        state.menus = [];
                        state.is_admin = false;
                    }

                    this.commit('updateMenulist')
                    
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
            }
        }
    }
};

export default app;