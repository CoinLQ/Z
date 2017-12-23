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
            <div class="form login">
                <div class="hd">
                    <img class="l" src="./img/lline-v1.png" alt="">
                    <h3><img src="./img/title-v1.png" alt=""></h3>
                    <img class="r" src="./img/rline-v1.png" alt="">
                </div>
                <div class="bd">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <div class="item">
                            <FormItem prop="userName">
                                <Input class="login_specific" v-model="form.userName" placeholder="请输入用户名"></Input>
                            </FormItem>
                        </div>
                        <div class="item">
                            <FormItem prop="password">
                                <Input class="login_specific" v-model="form.password" placeholder="请输入密码" type="password" ></Input>
                                <span class="forget">忘记密码?</span>
                            </FormItem>
                        </div>
                        <div class="item clearfix">
                            <p><span class="fl rember">记住密码</span><span class="fr">还没账号?&nbsp;点我<em @click="handleSignup">注册</em></span></p>
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

let saved_username = Cookies.get('user');

export default {


    data () {
        return {
            form: {
                userName: saved_username,
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            console.log('handleSubmit');
            let that = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    util.ajax.post('/auth/api-auth/', {
                            email: that.form.userName,
                            password: that.form.password
                    })
                    .then(function (response) {
                        that.handleLogin(response);
                    })
                    .catch(function (error) {
                        that.handleFailure(error);
                    });
                }
            });
        },

        handleLogin(response) {
            // debugger
            console.log(response);

            if (response.data.staff.is_active) {

                // this.$Notice.success({
                //     title: 'Succesfully logged in.',
                //     desc: ''
                // });

                Cookies.set('user', response.data.staff.email);
                Cookies.set('token', response.data.token);
                Cookies.set('last_login', response.data.staff.last_login);

                this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                this.$router.push({
                    name: 'otherRouter'
                });

            } else {
                // Pop user diabled
                this.$Notice.info({
                    title: 'The account is not activated, please contact admin.',
                    desc: ''
                });
            }

        },

        handleFailure(error) {
            // console.log(error);
            if (error.response.data.non_field_errors[0]) {
                // Test server should not reply auth message with 400.
            } else {

            }
            this.$Notice.error({
                title: 'Something went wrong.',
                desc: error.message
            });
        },

        handleSignup() {
             this.$router.push({
                name: 'signup'
            });           
        }
    }
};
</script>

<style>
</style>