import Env from './env';

let config = {
    env: Env,
    um: 'admin_lqdzj',
    ak: '6776ae5282a42ba2ed1c6a95be76dde6cfc7043b672fbc2b00062c2fa5ee69c6',
    dev: {
        proxyTable: {
            // proxy all requests starting with /api to jsonplaceholder
            '/auth': {
                target: 'http://api.lqdzj.cn:8000',
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/auth'
                }
            }
        }
    }
};
export default config;