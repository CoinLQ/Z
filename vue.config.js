module.exports = {
    devServer: {
        proxy: {
            '/auth': {
                target: 'http://api.lqdzj.cn:8000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/auth': '/auth'
                }
            },
        }
    }
};