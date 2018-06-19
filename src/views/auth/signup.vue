<style lang="css">
    @import './css/base.css';
    @import './css/user.css';
</style>

<template>
    <div class="wrapper" @keydown.enter="handleSubmit">
        <div class="header">
            <h1>
                <span class="banner-logo">
                    <img src="./img/logo-icon.jpg" key="min-logo" />
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
                        <div class="item username">
                            <FormItem prop="username">
                                <Input v-model.trim="form.username" placeholder="请输入用户名"></Input>
                            </FormItem>
                        </div>
                        <div class="item email">
                            <FormItem prop="email">
                                <Input v-model.trim="form.email" placeholder="请输入邮箱"></Input>
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
import config from '@/config/config.js';

let saved_username = Cookies.get('user');

export default {

    data () {

        const validatePass = (rule, value, callback) => {
            var regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}');
            if (!regex.test(value)) {
                // Complexity match checking
                callback(new Error('密码长度为8-30，必须包含数字、字母、特殊符号'))
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
        const validateUsername = (rule, value, callback) => {
            var regex = new RegExp('^(?=.*[-_a-zA-Z0-9]).{5,10}$');
            if (!regex.test(value)) {
                // Complexity match checking
                callback(new Error('用户名必须只包括数字、字母、连字号或下划线，长度在5-10之间'))
            }
            util.ajax.get('/auth/staff/exist_username?username='+value)
            
            .then(function (response) {
                if (response.data.status == -1) {
                    callback(new Error('此用户名已被注册.'));
                } else {
                    callback();
                }
            })
            .catch(function (error) {
                callback(new Error('无法查询用户名.'));
            });
        };
        return {
            form: {
                username: '',
                email: saved_username,
                password: '',
                repassword: ''
            },
            rules: {
                username: [
                    { type: 'string', required: true, message: this.$t('username required') },
                    { validator: validateUsername, trigger: 'blur' }
                ],
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
            this.registerSubmit(event)
        },
        registerSubmit (event) {
            let that = this;
            this.$refs.regForm.validate((valid) => {
                if (valid) {
                    util.ajax.post('/auth/api-register/', {
                            username: that.form.username,
                            email: that.form.email,
                            password: that.form.password
                    })
                    .then(function (response) {
                        that.handleSendVericode(event);
                        // that.$Notice.success({
                        //     title: '注册完成，请重新登录。',
                        //     desc: ''
                        // });
                        // that.gotoLogin();
                    })
                    .catch(function (error) {
                        if (error.response.data.msg) {
                            that.$Notice.error({
                            title: that.$t('Failed'),
                            desc: error.response.data.msg
                        });
                        } else {
                            that.$Notice.error({
                            title: that.$t('Failed'),
                            desc: error.message
                        });
                        }
                        
                    });
                }
            });
        },
        handleSendVericode(event) {
            let that = this;
            var time_value = new Date().getTime();
            util.ajax.get('/auth/staff/exist_email?email='+this.form.email)
            .then(function (response) {
                if (response.data.status == -1) {
                    
                    util.ajax.post('/auth/api-vericode/', {
                            code:200,
                            email: that.form.email,
                            username: that.form.username,
                            send_type:'register',
                            send_time:that.get_format_time()
                    })
                    .then(function (response) {
                        that.$Notice.success({
                            title: '激活链接已发送至邮箱，请查收。',
                            desc: ''
                        });
                        that.gotoLogin();
                    })
                    .catch(function (error) {
                        that.$Notice.error({
                            title: '激活链接发送失败了，请重试。',
                            desc: error.message
                        });
                        
                    });
                } else {
                    that.$Notice.error({
                        title: that.$t('邮箱不合法。'),
                        desc: ''
                    });
                }
            })
            .catch(function (error) {
                callback();
                that.$Notice.error({
                    title: that.$t('请求参数不合法。'),
                    desc: ''
                });
            });
        },
        get_format_time(){//获取当前时间，格式必须和后台要求的一致。
            let myDate = new Date();

            let Y = myDate.getFullYear(),
                M = myDate.getMonth() + 1,
                D = myDate.getDate() + 1,
                H = myDate.getHours(),
                Min = myDate.getMinutes(),
                S = myDate.getSeconds();

            if(M < 10){
                M = '0' + M ;
            }
            if(D < 10){
                D = '0' + D ;
            }
            if(H < 10){
                H = '0' + H ;
            }
            if(Min < 10){
                Min = '0' + Min ;
            }
            if(S < 10){
                S = '0' + S ;
            }
            return Y + '-' + M + '-' + D + ' ' + H + ':' + Min + ':' + S;
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
