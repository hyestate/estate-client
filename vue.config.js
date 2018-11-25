/**
 * @file vue 入口
 */
const path = require('path');
function getIP() {
    let interfaces = require('os').networkInterfaces();
    for (let devName of Object.keys(interfaces)) {
        let iface = interfaces[devName];
        for (let i = 0, len = iface.length; i < len; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

let port = '8001';

module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? '/public/static/' : `http://${getIP()}:${port}/`, // production的时候生效
    outputDir: 'dist',
    lintOnSave: true,
    devServer: {
        open: false, // process.platform === 'darwin'
        // publicPath: `http://${getIP()}:${port}/public/static/`, # 文档没说，但是devserver的publicPath只能这么传
        host: '0.0.0.0',
        port: port,
        https: false,
        hotOnly: false,
        // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: null, // string | Object
        before: app => {
            app.use((req, res, next) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                return next();
            });
        }
    },
    configureWebpack: {
        output: {
            // publicPath: process.env.NODE_ENV === 'production' ? '/public/static/' : `http://${getIP()}:${port}/`
        },
        resolve: {
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@views': path.resolve(__dirname, 'src/views')
            }
        },
        // css: {
        //     loaderOptions: {
        //         css: {
        //             // options here will be passed to css-loader
        //         },
        //         postcss: {
        //             // options here will be passed to postcss-loader
        //             plugins: [require('postcss-px2rem')({
        //                 remUnit: 75
        //             })]
        //         }
        //     }
        // }
    },
    // chainWebpack: config => {
    //     config.module
    //       .rule('css')
    //       .test(/\.css$/)
    //       .oneOf('vue')
    //       .resourceQuery(/\?vue/)
    //       .use('px2rem')
    //         .loader('px2rem-loader')
    //         .tap(options => {
    //             return {
    //                 remUnit: 64
    //             } 
    //         })
    //         .end()

    //     config.module
    //       .rule('less')
    //       .test('/\.less$/')
    //       .oneOf('vue')
    //       .resourceQuery(/\?vue/)
    //       .use('px2rem')
    //         .loader('px2rem-loader')
    //         .tap(options => {
    //             return {
    //                 remUnit: 64
    //             } 
    //         })
    //         .end()
    // }
};
