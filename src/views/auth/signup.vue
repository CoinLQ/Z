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
                    <h3><img src="./img/resg-v1.png" alt=""></h3>
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

        return {
            form: {
                email: saved_username,
                password: '',
                repassword: ''
            },
            rules: {
                email: [
                    { type: 'email', required: true },
                    { validator: validateEmail, trigger: 'blur' }
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
                            title: 'Success! Now please log in.',
                            desc: ''
                        });
                        that.gotoLogin();
                    })
                    .catch(function (error) {
                        that.$Notice.error({
                            title: 'Something went wrong.',
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