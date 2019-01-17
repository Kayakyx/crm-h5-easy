/*
axios的封装（./http.js）完成后，下面再简单说下api的统一管理。
整齐的api就像电路板一样，即使再复杂也能很清晰整个线路。上面说了，我们会新建一个api.js,然后在这个文件中存放我们所有的api接口。

首先我们在api.js中引入我们封装的get和post方法
*/

/**
 * api接口统一管理
 */
import { get, post } from './http';
console.log('api.js',get);
// 现在，例如我们有这样一个接口，是一个get请求接口：
    //http://m.maoyan.com/ajax/detailmovie?movieId=1206875
/**
 * p为要传的参数
 */
/*使用箭头函数简化代码*/
const apiTestGet = p => get('ajax/detailmovie',p);

// 现在，例如我们有这样一个接口，是一个post请求接口：
// http://m.maoyan.com/ajax/movie?forceUpdate=1547531959082
const apiTestPost = p => post('/ajax/movie', p);
//假如使用formData 提交参数, 设置post函数的最后一个参数为 true
const apiTestPostFData = p => post('/ajax/movie', p, true);
/*
//没挂载时的代码。
export { //想挂在到vue实例上需要将 export 给为 export default
    apiTestGet,
    apiTestPost,
    apiTestPostFData
}
*/

export default {
    apiTestGet,
    apiTestPost,
    apiTestPostFData
}

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
