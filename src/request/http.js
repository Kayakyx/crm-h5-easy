/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import router from '../router'; //引入路由模块
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，后面会提到
// vant的toast提示框组件，大家可根据自己的ui组件更改。
import {Toast} from 'vant';
/*
先导入vuex,因为我们要使用到里面的状态对象
vuex的路径根据自己的路径去写
我的vue-cli是3.x的，请根据你自己的store路径引入store。
//请求拦截器中要用到
*/
import store from '../store';
/*
环境的切换
我们的项目环境可能有开发环境、测试环境和生产环境。我们通过node的环境变量来匹配我们的默认的接口url前缀。axios.defaults.baseURL可以设置axios的默认请求地址就不多说了。
*/
if (process.env.NODE_ENV == 'development') {
    // axios.defaults.baseURL = 'http://m.maoyan.com';
    axios.defaults.baseURL = '/api'; //如果开发时，需要反向代理，这里可以写你的代理接口暗号 (vue-cli3.x 脚手架中 vue.config.js里配的,vue-cli2.x 在config/index.js里)
}
else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = 'https://www.ceshi.com';
}
else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'https://www.production.com';
}
/*
设置请求超时
通过axios.defaults.timeout设置默认的请求超时时间。例如超过了10s，就会告知用户当前请求超时，请刷新等。
*/
axios.defaults.timeout = 10000; //请求超时，时间为10s

/*
post请求头的设置
post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置，即设置post的请求头为application/x-www-form-urlencoded;charset=UTF-8
*/

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

/*
请求拦截器
我们在发送请求前可以进行一个请求的拦截，为什么要拦截呢，我们拦截请求是用来做什么的呢？
比如，有些请求是需要用户登录之后才能访问的，或者post请求的时候，我们需要序列化我们提交的数据。
这时候，我们可以在请求被发送之前进行一个拦截，从而进行我们想要的操作。
*/

axios.interceptors.request.use(
        //采用的箭头函数写法
        //config 为axios的请求配置信息。
        config => {
            // 每次发送请求之前判断vuex中是否存在token
            // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
            // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
            /*
            这里说一下token，一般是在登录完成之后，将用户的token通过localStorage或者cookie存在本地，
            然后用户每次在进入页面的时候（即在main.js中），会首先从本地存储中读取token，如果token存在说明用户已经登陆过，
            则更新vuex中的token状态。然后，在每次请求接口的时候，都会在请求的header中携带token，后台人员就可以根据你携带
            的token来判断你的登录是否过期，如果没有携带，则说明没有登录过。这时候或许有些小伙伴会有疑问了，就是每个请求都
            携带token，那么要是一个页面不需要用户登录就可以访问的怎么办呢？其实，你前端的请求可以携带token，但是后台可以
            选择不接收啊！
            */
            const token = store.state.token; //获取vuex 中的token （要提前在vuex的store定义token）
            console.log(store);
            token && (config.headers.Authorization = token); //token 存在的情况下， config.headers.Authorization = token
            return config;
        },
        //error 为错误信息
        error => {
            return Promise.error(error);
    });

/*
响应拦截器
响应拦截器很好理解，就是服务器返回给我们的数据，我们在拿到之前可以对他进行一些处理。例如上面的思想：如果后台返回的状态码是200，
则正常返回数据，否则的根据错误的状态码类型进行一些我们需要的错误，其实这里主要就是进行了错误的统一处理和没登录或登录过期后调整
登录页的一个操作。

要注意的是，下面的Toast()方法，是我引入的vant库中的toast轻提示组件，你根据你的ui库，对应使用你的一个提示组件。
*/
axios.interceptors.response.use(
    response => {
        // console.log("hahahha");
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            // console.log('xixixixxi',response);
            return Promise.resolve(response);
        } else {
            // console.log('lalala');
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        console.log('errorerror',error);
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                    Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);  //在vuex中的mutations 定义俺好哦 loginSuccess(store,parms){store.token = parms};方法
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    // console.log(404);
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    }
);

/*
封装好axios之后,我们在来封装一下，axios的get，和post方法。
封装get方法和post方法
我们常用的ajax请求方法有get、post、put等方法，相信小伙伴都不会陌生。axios对应的也有很多类似的方法，不清楚的可以看下文档。
但是为了简化我们的代码，我们还是要对其进行一个简单的封装。下面我们主要封装两个方法：get和post。

get方法：我们通过定义一个get函数，get函数有两个参数，第一个参数表示我们要请求的url地址，第二个参数是我们要携带的请求参数。
get函数返回一个promise对象，当axios其请求成功时resolve服务器返回 值，请求失败时reject错误值。最后通过export抛出get函数

*/

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
        })
    });
}

/*
**post方法：**原理同get基本一样，但是要注意的是，post方法必须要使用对提交从参数对象进行序列化的操作，所以这里我们通
  过node的qs模块来序列化我们的参数。这个很重要，如果没有序列化操作，后台是拿不到你提交的数据的(如果你们的后台不需要
  序列化，可以是使用isFromData配置,是否序列化)。这就是文章开头我们import QS from ‘qs’;的原因。如果不明白序列化是
  什么意思的，就百度一下吧，答案一大堆。
*/
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @isFormData {Boolean} isFormData [是否以FormData的形式请求，默认false]
 */
function post(url, params, isFormData) {
    let data = isFormData ? QS.stringify(params) : params;
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err =>{
                reject(err.data)
            })
    });
}
/*
这里有个小细节说下，axios.get()方法和axios.post()在提交数据时参数的书写方式还是有区别的。
区别就是，get的第二个参数是一个{}，然后这个对象的params属性是一个参数对象。
而post的第二个参数就是一个参数对象。两者略微的区别要留意哦！
举个例子：
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(）
-------------
axios.post('/user', {
    ID: 12345
  })
  .then(）
不过没关系在我们暴露出去的 get 和 post 函数中，这里已经封装好了，传参的格式都为对象，
get('/user', {
    ID: 12345
  })
  .then(）
-----------
post('/user', {
    ID: 12345
  })
  .then(）
*/

//最后通过export抛出get,post函数
/*
附录：
export default 和 export 区别
1.export与export default均可用于导出常量、函数、文件、模块等
2.在一个文件或模块中，export、import可以有多个，export default仅有一个
3.通过export方式导出，在导入时要加{ }，导入时需要import { get, post } from './http';详见api.js，
  export default则不需要, 直接引入 例如： import http from './http', 然后再在 http上找暴露处理的方法
4.
    (1) 输出单个值，使用export default
    (2) 输出多个值，使用export
    (3) export default与普通的export不要同时使用
*/
export {
    get,
    post
}

//axios的封装基本就完成了，下面再简单说下api的统一管理。
// 整齐的api就像电路板一样，即使再复杂也能很清晰整个线路。
// 上面说了，我们会新建一个api.js,然后在这个文件中存放我们所有的api接口。（请移步./api.js）



















