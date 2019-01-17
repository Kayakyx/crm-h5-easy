<template>
    <div class="work">
        <!--使用表情属性传递 Header组件显示的内容-->
        <Header title="工作"></Header>
        work
        <van-button type="primary" @click="goTest">去测试页</van-button>
    </div>
</template>

<script>
    import Header from '../components/Header';
    export default {
        name: "Work",
        components: {Header},
        methods: {
            goTest(){
                this.$router.push('/testpage');
            }
        },

    }
</script>

<style scoped>

</style>