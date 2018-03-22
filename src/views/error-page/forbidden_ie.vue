<style lang="less">
    @import './404.less';
</style>

<template>
    <div class="error404">
        <div class="error404-body-con">
            <Card>
                <div class="error404-body-con-title">4<span><Icon type="ios-navigate-outline"></Icon></span>3</div>
                <p class="error404-body-con-message">不支持IE</p>
                <div class="error404-btn-con">
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Ie404',
    methods: {
        backPage () {
            this.$router.go(-1);
        },
        goHome () {
            this.$router.push({
                name: 'home_index'
            });
        }
    }
};
</script>
