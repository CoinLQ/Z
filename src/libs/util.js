import axios from 'axios';
import semver from 'semver';
import env from '../config/env';
import packjson from '../../package.json';
import Cookies from 'js-cookie';
import _ from 'lodash';

let util = {

};
util.title = function(title) {
    title = title ? title : '龙泉大藏经校勘平台';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://api.lqdzj.cn' :
    env === 'production' ?
    'http://api.lqdzj.cn' :
    'http://work-api.lqdzj.cn';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.ajax.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

util.ajax.interceptors.request.use(
    config => {
        if (Cookies.get('token')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `token ${Cookies.get('token')}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.includedThisRoute = function(p_path, path, menus) {
    let c_path;
    if (path) {
        c_path = p_path + '/' + path;
    } else {
        c_path = p_path;
    }
    
    return _.includes(menus, c_path);
}

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    let routers = vm.$store.state.app.routers;
    vm.$store.commit('updateBannerHeader', '');
    routers.forEach(item => {
        if (!item.children) {
            return
        }
        item.children.forEach(child => {
            if (child.name === name) {
                title = util.handleTitle(vm, child);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        });
        
    });
    let currentPathArr = [];
    let currentPathObj = routers.filter(item => {
        if (!item.children) {
            return false
        }
        if (_.find(item.children, function(child) { return child.name === name })) {
            return true
        }    
    })[0];
    let detailPathObj = util.getRouterObjByName(routers, name);
    if (currentPathObj && detailPathObj.name === 'home_index') {
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ];
    } else if (currentPathObj && currentPathObj.children.length >=1 && isOtherRouter) {
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            },
            {
                title: detailPathObj.title,
                path: '',
                name: name
            }
        ];
    } else if (currentPathObj && currentPathObj.children.length >=1 && !isOtherRouter) {
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            },
            {
                title: currentPathObj.title,
                path: '',
                name: name
            },
            {
                title: util.handleTitle(vm, detailPathObj),
                path: '',
                name: name
            }
        ];
    }
    if (currentPathObj) {
        vm.$store.commit('addOpenSubmenu', currentPathObj.name);
    }
    vm.$store.commit('setCurrentPath', currentPathArr);
    util.title(util.handleTitle(vm, detailPathObj));
    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {

    return ;
    if (!vm.$store) {
      return
    }
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        if (semver.lt(packjson.version, version)) {
            // vm.$Notice.info({
            //     title: '后台已更新啦',
            //     desc: '<p>Z平台已更新到' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/CoinLQ/Z/releases" target="_blank">前往github查看</a>'
            // });
        }
    });
};


util.getImageClip = function(imgObj, newWidth, newHeight, startX, startY, ratio){
    /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
    //set up canvas for thumbnail
    let tnCanvas = document.createElement('canvas');
    let tnCanvasContext = tnCanvas.getContext('2d');
    let bufferCanvas = document.createElement('canvas');
    let bufferContext = bufferCanvas.getContext('2d');
    tnCanvas.width = newWidth; tnCanvas.height = newHeight;

    /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */

    bufferCanvas.width = imgObj.width;
    bufferCanvas.height = imgObj.height;
    bufferContext.drawImage(imgObj, 0, 0);

    /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
    tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio,0,0, newWidth, newHeight);
    return tnCanvas.toDataURL("image/png");
}

util.createImgObjWithUrl = function(url) {
    // console.log('Img ' + url)
    return new Promise(function(resolve, reject){
        let image = new Image();
        image.crossOrigin = "*";
        image.onload = function(e){
            resolve(e);
        };
        image.onerror = function(e) {
            reject(e);
        }
        image.src = url;
    });
}

util.getColumnImageUrlFromCode = function (column_code) {
    const regex = /^.*_.*/;
    if(regex.test(column_code)){
        Array.prototype.subarray=function(start,end){
            if(!end){ end=-1;}
           return this.slice(start, this.length+1-(end*-1));
        }
        let column_path = column_code.split('_').subarray(0,-2).join("/")
        return "https://s3.cn-north-1.amazonaws.com.cn/lqdzj-col/" + column_path + "/" + column_code + ".jpg"
    }
    //说明column_code不匹配规则, 默认显示加载中...todo 后续改加载失败的图片.
    // this.clip = '/static/img/FhHRx.gif';
}

// simulate the color feeling of red on the old paper
util.getRed = function() {
    let random = Math.random();
    let red = ['#E43B46', '#DF3B49', '#E63A4A', '#EB3845'][~~(random*4)];
    let alpha = 128 + ~~(random*128); // 200 + [0-55]
    return red + alpha.toString(16);
}

export default util;
