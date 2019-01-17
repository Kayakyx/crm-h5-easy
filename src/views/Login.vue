<template>
    <div class="login">
        <Header title="登录"></Header>

        <van-button type="primary" @click="login">登录</van-button>
    </div>
</template>

<script>
    import Header from '../components/Header'
    export default {
        name: "Login",
        components: {Header},
        methods: {
            //模拟登录
            login(){
                sessionStorage.setItem('isLogin','1');
                this.$router.push({name: 'Work'});
            }
        }
    }
</script>

<style scoped>

</style>