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
                    <h3><img src="./img/reset-v1.png" alt=""></h3>
                    <img class="r" src="./img/rline-v1.png" alt="">
                </div>
                <div class="bd">
                    <Form ref="resetForm" :model="form" :rules="rules">
                        <div class="item email">
                            <FormItem prop="email">
                                <input v-model.trim="form.email" type="text" placeholder="请输入您的注册邮箱">
                            </FormItem>
                        </div>
                        <div class="item vericode">
                            <FormItem prop="vericode">
                                <input v-model.trim="form.vericode" type="text" placeholder="请输入您收到的验证码">
                                <span class="send" @click="handleSendVericode">点击发送验证码</span>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="password">
                                <input v-model.trim="form.password" type="password" placeholder="请输入您的新密码">
                                <span class="hidden"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item checkmark">
                            <FormItem prop="repassword">
                                <input v-model.trim="form.repassword" type="password" placeholder="再次输入您的新密码">
                                <span class="hidden"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item clearfix">
                            <p><span class="fr">想起来了?&nbsp;点我<em @click="handleLogin">登录</em></span></p>
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

        const validatePass = (rule, value, callback) => {
            var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}');
            if (!regex.test(value)) {
                // Complexity match checking
                callback(new Error('The password must contain at least 6 and max 30 of mixings of numbers, alphabets, specials.'))
            }
            callback();
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value !== this.form.password) {
                callback(new Error('The two input passwords do not match!'));
            } else {
                callback();
            }
        };
        const validateEmail = (rule, value, callback) => {
            // TODO: Check available account name
            // util.ajax.post('/auth/check-avail-email', {
            //     email: value
            // })
            // .then(function (response) {

            // })
            // .catch(function (error) {

            // });
            callback();
        };
        const validateVericode = (rule, value, callback) => {
            // TODO: Check vericode
            callback();
        }

        return {
            form: {
                email: saved_username,
                vericode: '',
                password: '',
                repassword: ''
            },
            rules: {
                email: [
                    { type: 'email', required: true },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                vericode: [
                    { type: 'string', required: true },
                    { validator: validateVericode, trigger: 'blur'}
                ],
                password: [
                    { type: 'string', min: 6, required: true },
                    { validator: validatePass, trigger: 'blur' }
                ],
                repassword: [
                    { type: 'string', required: true },
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            console.log('handleSubmit');
            let that = this;
            this.$refs.resetForm.validate((valid) => {
                if (valid) {
                    util.ajax.post('/auth/api-resetpw/', {
                            email: that.form.email,
                            password: that.form.password
                    })
                    .then(function (response) {
                        that.$Notice.success({
                            title: 'Now please use new password to login.',
                            desc: ''
                        });

                        that.handleLogin();
                    })
                    .catch(function (error) {
                        that.handleFailure(error);
                    });
                }
            });
        },

        handleFailure(error) {
            this.$Notice.error({
                title: 'Something went wrong.',
                desc: error.message
            });
        },

        handleLogin() {
             this.$router.push({
                name: 'login'
            });
        },

        handleSendVericode() {
            let that = this;
            this.$refs.resetForm.validateField('email',(error) => {
                if (!error) {
                    util.ajax.post('/auth/api-vericode/', {
                        email: that.form.email
                    })
                    .then(function (response) {
                        that.$Notice.info({
                            title: 'Vericode has been sent, please check email.',
                            desc: ''
                        });
                    })
                    .catch(function (error) {
                        that.handleFailure(error);
                    });
                }
            });
        }
    }
};
</script>

<style>
</style>