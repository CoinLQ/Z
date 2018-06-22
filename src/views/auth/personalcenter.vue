<style lang="css">
  @import "./css/base.css";
  @import "./css/personal.css";
</style>
  <style>
* {
  margin: 0;
  padding: 0;
}

body {
  font: 15px/1.3 "Open Sans", sans-serif;
  color: #5e5b64;
}
a,
a:visited {
  outline: none;
  color: #389dc1;
}

a:hover {
  text-decoration: none;
}

section,
footer,
header,
aside,
nav {
  display: block;
}

/* The menu */
nav {
  display: inline-block;
  margin: 60px auto 45px;
  background-color: #5597b4;
  box-shadow: 0 1px 1px #ccc;
  border-radius: 2px;
}

nav a {
  display: inline-block;
  padding: 18px 30px;
  color: #fff !important;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none !important;
  line-height: 1;
  text-transform: uppercase;
  background-color: transparent;

  -webkit-transition: background-color 0.25s;
  -moz-transition: background-color 0.25s;
  transition: background-color 0.25s;
}

nav a:first-child {
  border-radius: 2px 0 0 2px;
}

nav a:last-child {
  border-radius: 0px 2px 2px 0px;
}

nav.base_info .base_info,
nav.reset_pwd .reset_pwd {
  background-color: #e35885;
}

p {
  font-size: 22px;
  font-weight: bold;
  color: #7d9098;
}

p b {
  color: #fff;
  display: inline-block;
  padding: 5px 10px;
  background-color: #c4d7e0;
  border-radius: 2px;
  text-decoration: uppercase;
  font-size: 18px;
}
button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 5px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 4px;
}
</style>
<template>
  <div id="main" align="center">
        <!-- 导航栏 -->
        <nav :class="activeName">
            <a href="#" class="base_info" @click="makeActive('base_info')">修改用户名</a>
            <a href="#" class="reset_pwd" @click="makeActive('reset_pwd')"> 重置密码  </a>
        </nav>
        <!-- 主区域 -->
        <div class="main w">
          <div class="form">
            <!-- 用户基本信息 -->
            <div v-if="this.activeName=='base_info'">
              <div class="bd">
                  <Form ref="regForm" :model="form" :rules="rules">
                      <div class="item username">
                          <FormItem prop="username">
                              <Input v-model.trim="form.username" placeholder="请输入新用户名"></Input>
                          </FormItem>
                      </div>
                      <div class="item password">
                          <FormItem prop="password">
                              <input v-model.trim="form.password" placeholder="请输入您的密码" type="text" v-if="form.show_passwd">
                              <input v-model.trim="form.password" placeholder="请输入您的密码" type="password" v-else>
                              <span :class="{'hidden': true, 'show-passwd': form.show_passwd}" @click="form.show_passwd = !form.show_passwd"><img src="./img/hidden.png" alt=""></span>
                          </FormItem>
                      </div>
                      <div>
                        <FormItem prop="submit">
                          <button @click="resetusernameSubmit" type="button">提交</button>
                        </FormItem>
                      </div>
                      <br>
                  </Form>
                </div>
            </div>
            
            <!-- 重置密码 -->
            <div v-if="this.activeName=='reset_pwd'">
              <div class="bd">
                    <Form ref="regForm" :model="form" :rules="rules">
                        <div class="item password">
                            <FormItem prop="oldpassword">
                                <input v-model.trim="form.oldpassword" placeholder="请输入您的原密码" type="text" v-if="form.show_oldpasswd">
                                <input v-model.trim="form.oldpassword" placeholder="请输入您的原密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_oldpasswd}" @click="form.show_oldpasswd = !form.show_oldpasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="newpassword">
                                <input v-model.trim="form.newpassword" placeholder="请输入您的新密码" type="text" v-if="form.show_newpasswd">
                                <input v-model.trim="form.newpassword" placeholder="请输入您的新密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_newpasswd}" @click="form.show_newpasswd = !form.show_newpasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item checkmark">
                            <FormItem prop="repassword">
                                <input v-model.trim="form.repassword" placeholder="再次输入您的新密码" type="text" v-if="form.show_repasswd">
                                <input v-model.trim="form.repassword" placeholder="再次输入您的新密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_repasswd}" @click="form.show_repasswd = !form.show_repasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div>
                          <FormItem prop="submit">
                            <button @click="resetpasswordSubmit" type="button">提交</button>
                          </FormItem>
                        </div>
                        <br>
                    </Form>
                </div>
                
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import Cookies from "js-cookie";
import util from "@/libs/util";
import config from "@/config/config.js";

let cookies_username = Cookies.get("username");
let cookies_email = Cookies.get("user");

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      var regex = new RegExp(
        "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}"
      );
      if (!regex.test(value)) {
        // Complexity match checking
        callback(new Error("密码长度为8-30，必须包含数字、字母、特殊符号"));
      }
      callback();
    };
    const validatePassCheck = (rule, value, callback) => {
        if (value !== this.form.newpassword) {
            callback(new Error('两次密码输入的不同。'));
        } else {
            callback();
        }
    };
    const validateEmail = (rule, value, callback) => {
      util.ajax
        .get("/auth/staff/exist_email?email=" + value)
        .then(function(response) {
          if (response.data.status == -1) {
            callback();
          } else {
            callback(new Error("此邮箱还未注册."));
          }
        })
        .catch(function(error) {
          callback();
        });
    };
    const validateVericode = (rule, value, callback) => {
      // TODO: Check vericode
      callback();
    };
    return {
      activeName: "base_info",
      form: {
        vericode: "",
        email: cookies_email,
        username:cookies_username,
        password:"",
        oldpassword: "",
        newpassword: "",
        repassword: "",
        show_oldpasswd: false,
        show_newpasswd: false,
        show_repasswd: false,
        send_type:'base_info',
      },
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: this.$t("需要有效email地址")
          },
          { validator: validateEmail, trigger: "blur" }
        ],
        newpassword: [
          {
            type: "string",
            min: 6,
            required: true,
            message: this.$t("密码长度为8-30，必须包含数字、字母、特殊符号")
          },
          { validator: validatePass, trigger: "blur" }
        ],
        repassword: [
          { type: 'string', required: true, message: this.$t('两次输入的密码必须一致') },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.form.email = cookies_email;
    this.form.username = cookies_username;
  },
  methods: {
    makeActive: function(item) {
      this.activeName = item;
      this.form.send_type = item;
      console.log('send_type:'+item)
    },
    resetusernameSubmit(event) {
      let that = this;
      this.$refs.regForm.validate(valid => {
        if (valid) {
          util.ajax
            .put("/auth/home-resetpw/", {
              username: that.form.username,
              email: that.form.email,
              send_type: that.form.send_type,
              password: that.form.password
            })
            .then(function(response) {
              that.$Notice.success({
                title: "用户名修改成功",
                desc: ""
              });
              Cookies.remove('username');
              Cookies.set('username', username);
            })
            .catch(function(error) {
              if (error.response.data.msg) {
                that.$Notice.error({
                  title: that.$t("Failed"),
                  desc: error.response.data.msg
                });
              } else {
                that.$Notice.error({
                  title: that.$t("Failed"),
                  desc: error.message
                });
              }
            });
        } else {
          that.$Notice.error({
            title: that.$t("Failed"),
            desc: "错误的请求参数"
          });
        }
      });
    },
    resetpasswordSubmit(event) {
      let that = this;
      this.$refs.regForm.validate(valid => {
        if (valid) {
          util.ajax
            .put("/auth/home-resetpw/", {
              email: that.form.email,
              send_type: that.form.send_type,
              oldpassword: that.form.oldpassword,
              newpassword: that.form.newpassword
            })
            .then(function(response) {
              that.$Notice.success({
                title: "密码修改成功",
                desc: ""
              });
              Cookies.set('username', username);
            })
            .catch(function(error) {
              if (error.response.data.msg) {
                that.$Notice.error({
                  title: that.$t("Failed"),
                  desc: error.response.data.msg
                });
              } else {
                that.$Notice.error({
                  title: that.$t("Failed"),
                  desc: error.message
                });
              }
            });
        } else {
          that.$Notice.error({
            title: that.$t("Failed"),
            desc: "错误的请求参数"
          });
        }
      });
    },
  }
};
</script>
