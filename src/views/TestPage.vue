<template>
    <div class="testpage">
        testpage
        <br>
        <van-button type="primary" @click="handleGet">get请求测试</van-button>
        <br>
        <van-button type="warning" @click="handlePost">post请求测试</van-button>
        <br>
        <van-button type="danger" @click="handleFromData">post,FormData测试</van-button>
        <br>
        <van-button type="warning" @click="handleTost">Tost测试</van-button>
        <div class="remdiv">rem-Box</div>
    </div>
</template>

<script>
/*
    //没有把 接口js 挂载到 vue 实例上（需要将api.js中的export 给为export default），调用接口的代码
    import {apiTestGet, apiTestPost, apiTestPostFData} from "../request/api";
    /!*上面这样使用接口的 时候还得通过import 引入，很麻烦！所以准备把 api.js在main.js 中挂载到 vue实例上，这样就可以使用this调用了*!/

    export default {
        name: "TestPage",
        methods: {
/!*            async handleGet(){
                let data = await apiTestGet({movieId: 1206875});
                console.log(data);
                document.write(data);
            },*!/
            handleGet(){
                let data = apiTestGet({movieId: 1206875})
                    .then(function () {
                        console.log(1);
                    })
                    .catch(function () {
                        console.log(2);
                    })
            },
            async handlePost(){
                let data = await apiTestPost({forceUpdate: 1547531959082});
                console.log(data);
            },
            async handleFromData(){ //post请求序列化
                let data = await apiTestPostFData({forceUpdate: 1547531959082});
                console.log(data);
            },
            //Toast测试
            handleTost(){
                this.$toast('提示文案');
            }

        }
    }
*/



/**把 接口js 挂载到 vue 实例上，调用接口的代码*/

export default {
    name: "TestPage",
    methods: {
        /*          async handleGet(){
                let data = await apiTestGet({movieId: 1206875});
                console.log(data);
                document.write(data);
                },*/
        handleGet() {
            this.$api.apiTestGet({movieId: 1206875})
                .then(function (res) {
                    console.log(res);
                })
                .catch(function (err) {
                    console.log(2,err);
                })
        },
        async handlePost() {
            let data = await this.$api.apiTestPost({forceUpdate: 1547531959082});
            console.log(data);
        },
        async handleFromData() { //post请求序列化
            let data = await this.$api.apiTestPostFData({forceUpdate: 1547531959082});
            console.log(data);
        },
        //Toast测试
        handleTost() {
            this.$toast('提示文案');
        }
    }
}
</script>

<style scoped>
    .remdiv{
        width: 200px;
        height: 200px;
        background-color: blue;
    }
</style>