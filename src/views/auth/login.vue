<style lang="css">
    @import './css/base.css';
    @import './css/user.css';
</style>

<template>
    <div class="wrapper" @keydown.enter="handleSubmit">
        <div class="header">
            <h1><img src="./img/logo-v1.png" alt=""></h1>
        </div>
        <div class="main w">
            <div class="form">
                <div class="hd">
                    <img class="l" src="./img/lline-v1.png" alt="">
                    <h3>登录校勘平台</h3>
                    <img class="r" src="./img/rline-v1.png" alt="">
                </div>
                <div class="bd">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <div class="item email">
                            <FormItem prop="email">
                                <Input v-model.trim="form.email" placeholder="请输入邮箱地址"></Input>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="password">
                                <Input v-model.trim="form.password" placeholder="请输入密码" type="password" ></Input>
                                <router-link :to="{name: 'resetpasswd'}"><span class="forget">忘记密码?</span></router-link>
                            </FormItem>
                        </div>
                        <div class="item clearfix">
                            <p><Checkbox v-model="keepLogin"><span class="fl rember" style="font-size:18px;font-weight:400;">保持登录状态7天</span></Checkbox><span class="fr">还没账号?&nbsp;点我<router-link :to="{name: 'signup'}"><em>注册</em></router-link></span></p>
                        </div>
                    </Form>
                </div>
                <div class="btn" @click="handleSubmit"><img src="./img/btn-v1.png" alt=""></div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import util from '@/libs/util'

export default {


    data () {
        let saved_username = Cookies.get('user');
        return {
            form: {
                email: saved_username,
                password: ''
            },
            rules: {
                email: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            },
            keepLogin: false
        };
    },
    mounted() {
        this.$Notice.config({top: 50, duration: 3});
    },
    methods: {
        handleSubmit () {
            console.log('handleSubmit');
            let that = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    util.ajax.post('/auth/api-auth/', {
                            email: that.form.email,
                            password: that.form.password
                    }, { baseURL: '/' })
                    .then(function (response) {
                        that.handleSuccess(response);
                    })
                    .catch(function (error) {
                        that.handleFailure(error);
                    });
                }
            });
        },

        handleSuccess(response) {
            if (response.data.staff.is_active) {

                let staff = response.data.staff;
                Cookies.set('user', staff.email);
                // Cookies.set('last_login', response.data.staff.last_login);

                if (this.keepLogin) {
                    Cookies.set('token', response.data.token, { expires: 7 });
                } else {
                    Cookies.set('token', response.data.token);
                }
                this.$store.commit('setMenus', staff.menus);
                this.$store.commit('setAdmin', staff.is_admin);

                this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                this.$router.push({
                    name: 'otherRouter'
                });

            } else {
                // Pop user diabled
                this.$Notice.info({
                    title: this.$t('The account is not activated, please contact admin.'),
                    desc: ''
                });
            }

        },

        handleFailure(error) {
            let message = this.$t(error.message);
            if (error.response && error.response.status == 400) {
                message = error.response.data.non_field_errors;

            }
            this.$Notice.error({
                title: this.$t('Failed'),
                desc: message
            });
        }
    }
};
</script>

<style>
</style>
