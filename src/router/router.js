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
        { path: 'error-page', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } },
        { path: 'pick-task/:task*', title: '任务领取页面', name: 'picktask_index', component: resolve => { require(['@/views/collatetask/welcome.vue'], resolve); } }
    ]
};

export const collateRouter = {
    path: '/collate',
    icon: 'ios-list-outline',
    name: 'collate',
    title: '校勘流程',
    component: Main,
    children: [
        { path: 'correct/:id*', title: '文字校对', name: 'correct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'verify_correct/:id*', title: '文字校对审定', name: 'verify_correct', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
        { path: 'correct_difficult/:id*', title: '文字校对难字', name: 'correct_difficult', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
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
        { path: 'my_lqpunctfeedback/:id*', title: '我的定本标点反馈', name: 'my_lqpunctfeedback', icon: 'checkmark-round', component: resolve => { require(['@/views/collate/bridge_page.vue'], resolve); } },
    ]
};

export const appRouter = [
        {
            path: '/lqtripitaka',
            icon: 'ios-list-outline',
            name: 'lqtripitaka_menu',
            title: '龙泉藏经',
            component: Main,
            children: [
                { path: 'lqtripitaka/', access: 0, title: '龙泉藏经', name: 'lqtripitaka', icon: 'images', component: resolve => { require(['@/views/common/iframe_page.vue'], resolve); } },
            ]
        },
        {
            path: '/tripitaka',
            icon: 'ios-list-outline',
            name: 'tripitaka_menu',
            title: '实体藏经',
            component: Main,
            children: [
                { path: 'tripitaka/', access: 0, title: '实体藏经', name: 'tripitaka', icon: 'images', component: resolve => { require(['@/views/common/iframe_page.vue'], resolve); } },
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
                { path: 'judge', access: 0, title: '校勘判取', name: 'judge-history', icon: 'map', component: resolve => { require(['@/views/collate_history/history_judge.vue'], resolve); } },
                { path: 'verify_judge', access: 0, title: '校勘判取审定', name: 'verify-judge-history', icon: 'map', component: resolve => { require(['@/views/collate_history/history_verify_judge.vue'], resolve); } },
                { path: 'judge_difficult', access: 0, title: '校勘判取难字', name: 'judge-difficult-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_judge_difficult.vue'], resolve); } },
                { path: 'judgefeedback', access: 0, title: '校勘判取反馈', name: 'judgefeedback-history', icon: 'ios-paper', component: resolve => { require(['@/views/collate_history/history_judgefeedback.vue'], resolve); } },
                { path: 'punct', access: 0, title: '基础标点', name: 'punct-history', icon: 'quote', component: resolve => { require(['@/views/collate_history/history_punct.vue'], resolve); } },
                { path: 'verify_punct', access: 0, title: '基础标点审定', name: 'verify-punct-history', icon: 'quote', component: resolve => { require(['@/views/collate_history/history_verify_punct.vue'], resolve); } },
                { path: 'lqpunct', access: 0, title: '定本标点', name: 'lqpunct-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_lqpunct.vue'], resolve); } },
                { path: 'verify_lqpunct', access: 0, title: '定本标点审定', name: 'verify-lqpunct-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_verify_lqpunct.vue'], resolve); } },
                { path: 'lqpunctfeedback', access: 0, title: '定本标点反馈', name: 'lqpunctfeedback-history', icon: 'ios-compose', component: resolve => { require(['@/views/collate_history/history_lqpunctfeedback.vue'], resolve); } },
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
                { path: 'judge', access: 0, title: '校勘判取', name: 'judge-task', icon: 'map', component: resolve => { require(['@/views/collatetask/task_judge.vue'], resolve); } },
                { path: 'verify_judge', access: 0, title: '校勘判取审定', name: 'verify_judge-task', icon: 'map', component: resolve => { require(['@/views/collatetask/task_verify_judge.vue'], resolve); } },
                { path: 'judge_difficult', access: 0, title: '校勘判取难字', name: 'judge_difficult-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_judge_difficult.vue'], resolve); } },
                { path: 'judgefeedback', access: 0, title: '校勘判取反馈', name: 'judgefeedback-task', icon: 'ios-paper', component: resolve => { require(['@/views/collatetask/task_judgefeedback.vue'], resolve); } },
                { path: 'punct', access: 0, title: '基础标点', name: 'punct-task', icon: 'quote', component: resolve => { require(['@/views/collatetask/task_punct.vue'], resolve); } },
                { path: 'verify_punct', access: 0, title: '基础标点审定', name: 'verify_punct-task', icon: 'quote', component: resolve => { require(['@/views/collatetask/task_verify_punct.vue'], resolve); } },
                { path: 'lqpunct', access: 0, title: '定本标点', name: 'lqpunct-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_lqpunct.vue'], resolve); } },
                { path: 'verify_lqpunct', access: 0, title: '定本标点审定', name: 'verify_lqpunct-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_verify_lqpunct.vue'], resolve); } },
                { path: 'lqpunctfeedback', access: 0, title: '定本标点反馈', name: 'lqpunctfeedback-task', icon: 'ios-compose', component: resolve => { require(['@/views/collatetask/task_lqpunctfeedback.vue'], resolve); } },
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
        {
            path: '/mytask',
            icon: 'ios-list-outline',
            name: 'task',
            title: '我的切分任务',
            component: Main,
            children: [
                // { path: 'confidence', access: 0, title: '置信校对', name: 'zhixin-task', icon: 'arrow-graph-up-right', component: resolve => { require(['@/views/mytask/task_confidence.vue'], resolve); } },
                // { path: 'classify', access: 0, title: '聚类校对', name: 'julei-task', icon: 'ios-keypad', component: resolve => { require(['@/views/mytask/task_classify.vue'], resolve); } },
                // { path: 'checkleak', title: '查漏校对', name: 'chalou-task', icon: 'pinpoint', component: resolve => { require(['@/views/mytask/task_CheckLeak.vue'], resolve); } },
                { path: 'onebyone', access: 0, title: '切分校对', name: 'zhuzi-task', icon: 'images', component: resolve => { require(['@/views/mytask/task_OneByOneCheck.vue'], resolve); } },
                // { path: 'checkdel', access: 0, title: '删除审定', name: 'shanchu-task', icon: 'ios-close-outline', component: resolve => { require(['@/views/mytask/task_CheckDel.vue'], resolve); } },
                // { path: 'compare', title: '反馈审查', name: 'fankui-task', icon: 'ios-shuffle-strong', component: resolve => { require(['@/views/mytask/task_compare.vue'], resolve); } },
            ]
        },
        {
            path: '/jiaodui',
            icon: 'ios-grid-view',
            name: 'jiaodui',
            title: '切分任务大厅',
            component: Main,
            children: [
                // { path: 'confidence/:tid*', access: 0, title: '置信校对', name: 'confidence', icon: 'arrow-graph-up-right', component: resolve => { require(['@/views/jiaodui/b_confidence.vue'], resolve); } },
                // { path: 'classify/:tid*', access: 0, title: '聚类校对', name: 'classify', icon: 'ios-keypad', component: resolve => { require(['@/views/jiaodui/b_classify.vue'], resolve); } },
                // { path: 'checkleak/:tid*', title: '查漏校对', name: 'chalou-jiaodui', icon: 'pinpoint', component: resolve => { require(['@/views/jiaodui/b_CheckLeak.vue'], resolve); } },
                { path: 'onebyone/:tid*', access: 0, title: '切分校对', name: 'onebyone', icon: 'images', component: resolve => { require(['@/views/jiaodui/b_OneByOneCheck.vue'], resolve); } },
                // { path: 'checkdel/:tid*', access: 0, title: '删除审定', name: 'checkdel', icon: 'ios-close-outline', component: resolve => { require(['@/views/jiaodui/b_CheckDel.vue'], resolve); } },
                // { path: 'compare/:tid*', title: '反馈审查', name: 'fankui-jiaodui', icon: 'ios-shuffle-strong', component: resolve => { require(['@/views/jiaodui/b_compare.vue'], resolve); } },
            ]
        },

    ]


// // 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    signupRouter,
    resetPasswdRouter,
    otherRouter,
    ...appRouter,
    collateRouter,
    page500,
    page403,
    pagenoie,
    page404,
];



