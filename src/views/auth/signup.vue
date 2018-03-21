<style lang="css">
    @import './css/base.css';
    @import './css/user.css';
</style>

<template>
    <div class="wrapper" @keydown.enter="handleSubmit">
        <div class="header">
            <h1>
                <span class="banner-logo">
                    <img src="../../images/logo-min.png" key="min-logo" />
                </span>龙泉大藏经校勘平台
            </h1>
        </div>
        <div class="main w">
            <div class="form">
                <div class="hd">
                    <img class="l" src="./img/lline-v1.png" alt="">
                    <h3>用户注册</h3>
                    <img class="r" src="./img/rline-v1.png" alt="">
                </div>
                <div class="bd">
                    <Form ref="regForm" :model="form" :rules="rules">
                        <div class="item email">
                            <FormItem prop="email">
                                <Input v-model.trim="form.email" placeholder="请输入用户名"></Input>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="password">
                                <Input v-model.trim="form.password" placeholder="请输入密码" type="password" ></Input>
                            </FormItem>
                        </div>
                        <div class="item checkmark">
                            <FormItem prop="repassword">
                                <Input v-model.trim="form.repassword" placeholder="再输入密码" type="password" ></Input>
                            </FormItem>
                        </div>
                    </Form>
                    <div class="item clearfix">
                        <p><span class="fr">已有账号?&nbsp;点我<em @click='gotoLogin'>登录</em></span></p>
                    </div>
                </div>
                <div class="btn" @click="handleSubmit"><img src="././img/btn-v1.png" alt=""></div>
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
                callback(new Error('密码长度为6-30，必须包含数字、大小写字母、特殊符号'))
            }
            callback();
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value !== this.form.password) {
                callback(new Error('两次密码输入的不同。'));
            } else {
                callback();
            }
        };
        const validateEmail = (rule, value, callback) => {
            util.ajax.get('/auth/staff/exist_email?email='+value)
            .then(function (response) {
                if (response.data.status == -1) {
                    callback(new Error('此邮箱已被注册.'));
                } else {
                    callback();
                }
            })
            .catch(function (error) {
                callback();
            });
        };

        return {
            form: {
                email: saved_username,
                password: '',
                repassword: ''
            },
            rules: {
                email: [
                    { type: 'email', required: true, message: this.$t('email required') },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                password: [
                    { type: 'string', min: 6, required: true, message: this.$t('password required') },
                    { validator: validatePass, trigger: 'blur' }
                ],
                repassword: [
                    { type: 'string', required: true, message: this.$t('password must be same') },
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit (event) {
            let that = this;
            this.$refs.regForm.validate((valid) => {
                if (valid) {
                    util.ajax.post('/auth/api-register/', {
                            email: that.form.email,
                            password: that.form.password
                    })
                    .then(function (response) {
                        that.$Notice.success({
                            title: '注册完成，请重新登录。',
                            desc: ''
                        });
                        that.gotoLogin();
                    })
                    .catch(function (error) {
                        that.$Notice.error({
                            title: that.$t('Failed'),
                            desc: error.message
                        });
                    });
                }
            });
        },

        gotoLogin() {
             this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style>
</style>
