import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/auth/login.vue'], resolve); }
};

export const signupRouter = {
    path: '/signup',
    name: 'signup',
    meta: {
        title: 'Signup - 注册'
    },
    component: resolve => { require(['@/views/auth/signup.vue'], resolve); }
};

export const resetPasswdRouter = {
    path: '/resetpasswd',
    name: 'resetpasswd',
    meta: {
        title: 'Reset Password - 重置密码'
    },
    component: resolve => { require(['@/views/auth/resetpasswd.vue'], resolve); }
};
export const activateRouter = {
    path: '/activate/:id*',
    name: 'activate',
    meta: {
        title: 'Activate - 激活'
    },
    component: resolve => { require(['@/views/auth/activate.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const pagenoie = {
    path: '/noie',
    meta: {
        title: 'IE不被支持'
    },
    name: 'ie-403',
    component: resolve => { require(['@/views/error-page/forbidden_ie.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};

// // 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter =  {
    path: '/',
    name: 'otherRouter',
    icon: 'ios-grid-view',
    title: '其他',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/blank.vue'], resolve); } },
        { path: 'personalcenter', title: '修改信息', name: 'personal_center', component: resolve => { require(['@/views/auth/personalcenter.vue'], resolve); } },
        { path: 'error-page', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } },
        { path: 'pick-task/:task*', title: '任务领取页面', name: 'picktask_index', component: resolve => { require(['@/views/collatetask/welcome.vue'], resolve); } },
        { path: 'tripitaka/:id*', title: '实体藏经', name: 'tripitaka_detail', component: resolve => { require(['@/views/tripitaka/bridge_page.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
    ]
};

export const collateRouter = {
    path: '/collate',
    icon: 'ios-list-outline',
    name: 'collate',
    title: '我的任务',
    component: Main,
    children: [
        { path: 'correct/:id*', title: '文字校对', name: 'correct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_correct/:id*', title: '文字校对审定', name: 'verify_correct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'correct_difficult/:id*', title: '文字校对难字', name: 'correct_difficult', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'pagetask/:id*', title: '切分校对', name: 'pagetask', icon: 'checkmark-round', component: resolve => { require(['@/views/jiaodui/page_view.vue'], resolve); } },
        { path: 'pageverifytask/:id*', title: '切分校对审定', name: 'pageverifytask', icon: 'checkmark-round', component: resolve => { require(['@/views/jiaodui/pageverify_view.vue'], resolve); } },
        { path: 'prepagecoltask/:id*', title: '切分预处理', name: 'prepagecoltask', icon: 'checkmark-round', component: resolve => { require(['@/views/jiaodui/prepage_view.vue'], resolve); } },
        { path: 'prepagecolverifytask/:id*', title: '切分预处理审定', name: 'prepagecolverifytask', icon: 'checkmark-round', component: resolve => { require(['@/views/jiaodui/prepageverify_view.vue'], resolve); } },
        { path: 'judge/:id*', title: '校勘判取', name: 'judge', icon: 'ios-shuffle-strong', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_judge/:id*', title: '校勘判取审定', name: 'verify_judge', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'judge_difficult/:id*', title: '校勘判取难字', name: 'judge_difficult', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'judgefeedback/:id*', title: '校勘判取反馈', name: 'judgefeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'my_judgefeedback/:id*', title: '我的校勘判取反馈', name: 'my_judgefeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'punct/:id*', title: '基础标点', name: 'punct', icon: 'ios-shuffle-strong', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_punct/:id*', title: '基础标点审定', name: 'verify_punct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'lqpunct/:id*', title: '定本标点', name: 'lqpunct', icon: 'ios-shuffle-strong', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_lqpunct/:id*', title: '定本标点审定', name: 'verify_lqpunct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'lqpunctfeedback/:id*', title: '定本标点反馈', name: 'lqpunctfeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'correctfeedback/:id*', title: '文字校对反馈', name: 'correctfeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'mark/:id*', title: '格式标注', name: 'mark', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_mark/:id*', title: '格式标注审定', name: 'verify_mark', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'my_lqpunctfeedback/:id*', title: '我的定本标点反馈', name: 'my_lqpunctfeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'my_correctfeedback/:id*', title: '我的文字校对反馈', name: 'my_correctfeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
    ]
};

export const appRouter = [
        {
            path: '/lqdzj',
            icon: 'ios-list-outline',
            name: 'lqtripitaka_menu',
            title: '龙泉藏经',
            component: Main,
            children: [
                { path: '', access: 0, title: '经目列表', name: 'lqtripitaka', icon: 'images', component: resolve => { require(['@/views/common/iframe_page.vue'], resolve); } },
            ]
        },
        {
            path: '/tripitakas',
            icon: 'ios-list-outline',
            name: 'tripitaka_menu',
            title: '实体藏经',
            component: Main,
            children: [
                { path: '', access: 0, title: '藏经列表', name: 'tripitaka', icon: 'images', component: resolve => { require(['@/views/common/iframe_page.vue'], resolve); } },
            ]
        },
        {
            path: '/collate_history',
            icon: 'ios-list-outline',
            name: 'collate_history',
            title: '我的任务',
            component: Main,
            children: [
                { path: 'correct', access: 0, title: '文字校对', name: 'correct-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_correct.vue'], resolve); } },
                { path: 'verify_correct', access: 0, title: '文字校对审定', name: 'verify-correct-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_verify_correct.vue'], resolve); } },
                { path: 'correct_difficult', access: 0, title: '文字校对难字', name: 'correct-difficult-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_correct_difficult.vue'], resolve); } },
                { path: 'correctfeedback', access: 0, title: '文字校对反馈', name: 'correctfeedback-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_correctfeedback.vue'], resolve); } },
                { path: 'page_tasks', access: 0, title: '切分校对', name: 'page-task-history', icon: 'images', component: resolve => { require(['@/views/common_history/history_pagetask.vue'], resolve); } },
                { path: 'pageverify_tasks', access: 0, title: '切分校对审定', name: 'pageverify-task-history', icon: 'images', component: resolve => { require(['@/views/common_history/history_pageverifytask.vue'], resolve); } },
                { path: 'prepage_tasks', access: 0, title: '切分预处理', name: 'prepage-task-history', icon: 'images', component: resolve => { require(['@/views/common_history/history_prepagetask.vue'], resolve); } },
                { path: 'prepageverify_tasks', access: 0, title: '切分预处理审定', name: 'prepageverify-task-history', icon: 'images', component: resolve => { require(['@/views/common_history/history_prepageverifytask.vue'], resolve); } },
                { path: 'mark', access: 0, title: '格式标注', name: 'mark-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_mark.vue'], resolve); } },
                { path: 'verify_mark', access: 0, title: '格式标注审定', name: 'verify-mark-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_verify_mark.vue'], resolve); } },
                { path: 'lqpunct', access: 0, title: '定本标点', name: 'lqpunct-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_lqpunct.vue'], resolve); } },
                { path: 'verify_lqpunct', access: 0, title: '定本标点审定', name: 'verify-lqpunct-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_verify_lqpunct.vue'], resolve); } },
                { path: 'lqpunctfeedback', access: 0, title: '定本标点反馈', name: 'lqpunctfeedback-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_lqpunctfeedback.vue'], resolve); } },
                { path: 'judge', access: 0, title: '校勘判取', name: 'judge-history', icon: 'map', component: resolve => { require(['@/views/collate_history/history_judge.vue'], resolve); } },
                { path: 'verify_judge', access: 0, title: '校勘判取审定', name: 'verify-judge-history', icon: 'map', component: resolve => { require(['@/views/collate_history/history_verify_judge.vue'], resolve); } },
                { path: 'judge_difficult', access: 0, title: '校勘判取难字', name: 'judge-difficult-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_judge_difficult.vue'], resolve); } },
                { path: 'judgefeedback', access: 0, title: '校勘判取反馈', name: 'judgefeedback-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_judgefeedback.vue'], resolve); } },
            ]
        },
        {
            path: '/collate_tasks',
            icon: 'ios-grid-view',
            name: 'collate_tasks',
            title: '任务大厅',
            component: Main,
            children: [
                { path: 'correct', access: 0, title: '文字校对', name: 'correct-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_correct.vue'], resolve); } },
                { path: 'verify_correct', access: 0, title: '文字校对审定', name: 'verify_correct-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_verify_correct.vue'], resolve); } },
                { path: 'correct_difficult', access: 0, title: '文字校对难字', name: 'correct_difficult-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_correct_difficult.vue'], resolve); } },
                { path: 'correctfeedback', access: 0, title: '文字校对反馈', name: 'correctfeedback-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_correctfeedback.vue'], resolve); } },
                { path: 'pagetask', access: 0, title: '切分校对', name: 'pagetask-task', icon: 'images', component: resolve => { require(['@/views/common_tasks/task_pagerect.vue'], resolve); } },
                { path: 'pageverifytask', access: 0, title: '切分校对审定', name: 'pageverifytask-task', icon: 'images', component: resolve => { require(['@/views/common_tasks/task_pagerectverify.vue'], resolve); } },
                { path: 'prepagetask', access: 0, title: '切分预处理', name: 'prepagecoltask-task', icon: 'images', component: resolve => { require(['@/views/common_tasks/task_prepagerect.vue'], resolve); } },
                { path: 'prepageverifytask', access: 0, title: '切分预处理审定', name: 'prepagecolverifytask-task', icon: 'images', component: resolve => { require(['@/views/common_tasks/task_prepagerectverify.vue'], resolve); } },
                { path: 'mark', access: 0, title: '格式标注', name: 'mark-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_mark.vue'], resolve); } },
                { path: 'verify_mark', access: 0, title: '格式标注审定', name: 'verify_mark-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_verify_mark.vue'], resolve); } },
                { path: 'lqpunct', access: 0, title: '定本标点', name: 'lqpunct-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_lqpunct.vue'], resolve); } },
                { path: 'verify_lqpunct', access: 0, title: '定本标点审定', name: 'verify_lqpunct-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_verify_lqpunct.vue'], resolve); } },
                { path: 'lqpunctfeedback', access: 0, title: '定本标点反馈', name: 'lqpunctfeedback-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_lqpunctfeedback.vue'], resolve); } },
                { path: 'judge', access: 0, title: '校勘判取', name: 'judge-task', icon: 'map', component: resolve => { require(['@/views/collatetask/task_judge.vue'], resolve); } },
                { path: 'verify_judge', access: 0, title: '校勘判取审定', name: 'verify_judge-task', icon: 'map', component: resolve => { require(['@/views/collatetask/task_verify_judge.vue'], resolve); } },
                { path: 'judge_difficult', access: 0, title: '校勘判取难字', name: 'judge_difficult-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_judge_difficult.vue'], resolve); } },
                { path: 'judgefeedback', access: 0, title: '校勘判取反馈', name: 'judgefeedback-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_judgefeedback.vue'], resolve); } },
            ]
        },
        {
            path: '/myfeedback',
            icon: 'ios-grid-view',
            name: 'myfeedback',
            title: '我的反馈',
            component: Main,
            children: [
                { path: 'correct', access: 0, title: '文字校对', name: 'myfeedback-correct', icon: 'ios-paper', component: resolve => { require(['@/views/myfeedback/correct.vue'], resolve); } },
                { path: 'judge', access: 0, title: '校勘判取', name: 'myfeedback-judge', icon: 'map', component: resolve => { require(['@/views/myfeedback/judge.vue'], resolve); } },
                { path: 'lqpunct', access: 0, title: '定本标点', name: 'myfeedback-lqpunct', icon: 'ios-compose', component: resolve => { require(['@/views/myfeedback/lqpunct.vue'], resolve); } },
            ]
        },
        {
            path: '/help',
            icon: 'ios-list-outline',
            name: 'help',
            title: '系统说明',
            component: Main,
            children: [
                { path: '', title: '帮助', name: 'help_index', icon: 'help', component: resolve => { require(['@/views/help/index.vue'], resolve); } },
                { path: 'bbs', title: '论坛', name: 'help_bbs', type: 'href', icon: 'erlenmeyer-flask', href: 'http://bbs.lqdzj.cn' },
            ]
        },
        
    ]


// // 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    signupRouter,
    resetPasswdRouter,
    activateRouter,
    otherRouter,
    ...appRouter,
    collateRouter,
    page500,
    page403,
    pagenoie,
    page404,
];



