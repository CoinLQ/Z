<style lang="css">
    @import './css/base.css';
    @import './css/user.css';
</style>

<template>
    <div class="wrapper" @keydown.enter="handleSubmit">
        <div class="header">
            <h1>
                <span class="banner-logo">
                    <img  src="../../images/logo-tra-b.png" key="max-logo"  />
                </span>
            </h1>
        </div>
        <div class="main w">
            <div class="form">
                <div class="hd">
                    <img class="l" src="./img/lline-v1.png" alt="">
                    <h3>校勘平台 - 重置密码</h3>
                    <img class="r" src="./img/rline-v1.png" alt="">
                </div>
                <div class="bd">
                    <Form ref="regForm" :model="form" :rules="rules">
                        <div class="item email">
                            <FormItem prop="email">
                                <Input v-model.trim="form.email" placeholder="请输入邮箱"></Input>
                            </FormItem>
                        </div>
                        <div class="item vericode">
                            <FormItem prop="vericode">
                                <Input v-model.trim="form.vericode" placeholder="请输入您收到的验证码"></Input>
                                <span class="send" @click="handleSendVericode">点击发送验证码</span>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="password">
                                <input v-model.trim="form.password" placeholder="请输入您的新密码" type="text" v-if="form.show_passwd">
                                <input v-model.trim="form.password" placeholder="请输入您的新密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_passwd}" @click="form.show_passwd = !form.show_passwd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item checkmark">
                            <FormItem prop="repassword">
                                <input v-model.trim="form.repassword" placeholder="再次输入您的新密码" type="text" v-if="form.show_repasswd">
                                <input v-model.trim="form.repassword" placeholder="再次输入您的新密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_repasswd}" @click="form.show_repasswd = !form.show_repasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                    </Form>
                    <div class="item clearfix">
                        <p><span class="fr">想起来了?&nbsp;点我<em @click='gotoLogin'>登录</em></span></p>
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
            util.ajax.get('/auth/staff/exist_email/?email='+value)
            .then(function (response) {
                if (response.data.status == -1) {
                    callback();
                } else {
                    callback(new Error('此邮箱还未注册.'));
                }
            })
            .catch(function (error) {
                callback();
            });
        };
        const validateVericode = (rule, value, callback) => {
            // TODO: Check vericode
            callback();
        };
        return {
            form: {
                vericode: '',
                email: saved_username,
                password: '',
                repassword: '',
                show_passwd: false,
                show_repasswd: false,
            },
            rules: {
                email: [
                    { type: 'email', required: true, message: this.$t('需要有效email地址') },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                vericode: [
                    { type: 'string', required: true, message: this.$t('需要有效验证码')  },
                    { validator: validateVericode, trigger: 'blur'}
                ],
                password: [
                    { type: 'string', min: 6, required: true, message: this.$t('密码长度为8-30，必须包含数字、字母、特殊符号') },
                    { validator: validatePass, trigger: 'blur' }
                ],
                repassword: [
                    { type: 'string', required: true, message: this.$t('两次输入的密码必须一致') },
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit (event) {
            this.resetpasswordSubmit(event)
        },
        resetpasswordSubmit (event) {
            let that = this;
            this.$refs.regForm.validate((valid) => {
                if (valid) {
                    util.ajax.put('/auth/api-resetpw/', {
                            email: that.form.email,
                            vericode:that.form.vericode,
                            password: that.form.password
                    })
                    .then(function (response) {
                        that.$Notice.success({
                            title: '请用新密码重新登录。',
                            desc: ''
                        });
                        that.gotoLogin();
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
                }else{
                    that.$Notice.error({
                        title: that.$t('Failed'),
                        desc: '错误的请求参数'
                    });

                }
            });
        },
        gotoLogin() {
             this.$router.push({
                name: 'login'
            });
        },
        handleSendVericode(event) {
            let that = this;
            var time_value = new Date().getTime();
            util.ajax.get('/auth/staff/exist_email/?email='+this.form.email)
            .then(function (response) {
                if (response.data.status == -1) {
                    
                    util.ajax.post('/auth/api-vericode/', {
                            code:200,
                            email: that.form.email,
                            send_type:'forget',
                            send_time:that.get_format_time()
                    })
                    .then(function (response) {
                        that.$Notice.success({
                            title: '验证码已发送至邮箱，请查收。',
                            desc: ''
                        });
                    })
                    .catch(function (error) {
                        that.$Notice.error({
                            title: '验证码发送失败了，请重试。',
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

    },
    
};
</script>

<style>
</style>
