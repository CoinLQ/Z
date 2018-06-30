<style lang="css">
  @import "./css/base.css";
  @import "./css/personal.css";
  nav {
	display: inline-block;
	margin: 60px auto 45px;
	background-color: #5597b4;
	box-shadow: 0 1px 1px #ccc;
	border-radius: 2px;
  }
</style>

<template>
  <div id="person-main" align="center">
        <!-- 导航栏 -->
        <nav :class="activeName" style="margin: 60px auto 45px;background-color: #5597b4;">
            <a href="#" class="base_info" @click="makeActive('base_info')">修改用户名</a>
            <a href="#" class="reset_pwd" @click="makeActive('reset_pwd')"> 修改密码  </a>
        </nav>
        <!-- 主区域 -->
        <div class="person-main w">
          <div class="form">
            <!-- 用户基本信息 -->
            <div v-if="this.activeName=='base_info'">
              <div class="bd">
                  <Form ref="baseForm" :model="form" :rules="rules">
                      <div class="item username">
                          <FormItem prop="username" >
                              <Input v-model.trim="form.username" placeholder="请输入新用户名"></Input>
                          </FormItem>
                      </div>
                      <div class="item password">
                          <FormItem prop="password" >
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
            
            <!-- 修改密码 -->
            <div v-else-if="this.activeName=='reset_pwd'">
              <div class="bd">
                    <Form ref="pwdForm" :model="form" :rules="rules">
                        <div class="item password">
                            <FormItem prop="oldpassword" >
                                <input v-model.trim="form.oldpassword" placeholder="请输入您的原密码" type="text" v-if="form.show_oldpasswd">
                                <input v-model.trim="form.oldpassword" placeholder="请输入您的原密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_oldpasswd}" @click="form.show_oldpasswd = !form.show_oldpasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item password">
                            <FormItem prop="newpassword" >
                                <input v-model.trim="form.newpassword" placeholder="请输入您的新密码" type="text" v-if="form.show_newpasswd">
                                <input v-model.trim="form.newpassword" placeholder="请输入您的新密码" type="password" v-else>
                                <span :class="{'hidden': true, 'show-passwd': form.show_newpasswd}" @click="form.show_newpasswd = !form.show_newpasswd"><img src="./img/hidden.png" alt=""></span>
                            </FormItem>
                        </div>
                        <div class="item checkmark">
                            <FormItem prop="repassword" >
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
import Cookies from "js-cookie"
import util from "@/libs/util"
import _ from 'lodash'

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
      .get("/auth/staff/exist_email/?email=" + value)
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
    const validateUsername = (rule, value, callback) => {
      let arr = ['admin'];
      if (_.find(arr, function(r) {return r == value})) {
          callback(new Error('不可使用该用户名。'));
      }
      var regex = new RegExp('^(?=.*[-_a-zA-Z0-9]).{5,10}$');
      if (!regex.test(value)) {
          // Complexity match checking
          callback(new Error('用户名必须只包括数字、字母、连字号或下划线，长度在5-10之间'))
      }
      let request_url = '/auth/staff/exist_username/?username=' + value ;
      util.ajax.get(request_url)
      .then(function (response) {
          if (response.data.status == -1) {
              callback(new Error('此用户名已被使用。'));
          } else {
              callback();
          }
      })
      .catch(function (error) {
          callback(new Error('无法连接服务器。'));
          // callback();
      });
      
    };
    return {
      activeName: "base_info",
      form: {
        vericode: "",
        email: '',
        username:'',
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
        username: [
            { type: 'string', required: true, message: this.$t('username required') },
            { validator: validateUsername, trigger: 'blur' }
        ],
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
    this.form.email = Cookies.get('user');
    this.form.username = Cookies.get('username');
  },
  methods: {
    makeActive: function(item) {
      this.activeName = item;
      this.form.send_type = item;
      this.$nextTick(function (){
        if (item == 'base_info'){
          //初始化数据
          this.$refs.baseForm.resetFields();
        }else if(item == 'reset_pwd'){
          //初始化数据
          this.$refs.pwdForm.resetFields();
          this.form.oldpassword = "";
          this.form.newpassword = "";
          this.form.repassword = "";
        }
      });
    },
    resetusernameSubmit(event) {
      let that = this;
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          util.ajax.put("/auth/home-resetpw/", {
              username: that.form.username,
              email: Cookies.get('user'),
              send_type: that.form.send_type,
              password: that.form.password
            })
            .then(function(response) {
              that.$Notice.success({
                title: "用户名修改成功",
                desc: ""
              });
              //更新用户信息
              that.storeCommit(that.form.username, Cookies.get("user"));
              //返回首页
              that.goHome();
              
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
            desc: "密码错误。"
          });
        }
      });
    },
    resetpasswordSubmit(event) {
      let that = this;
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          util.ajax.put("/auth/home-resetpw/", {
              email: Cookies.get('user'),
              send_type: that.form.send_type,
              oldpassword: that.form.oldpassword,
              newpassword: that.form.newpassword
            })
            .then(function(response) {
              that.$Notice.success({
                title: "密码修改成功",
                desc: ""
              });
              that.goHome();
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
            desc: "新密码不一致。"
          });
        }
      });
    },
    storeCommit(username, email){
      this.$store.commit('setUserName', username);
      Cookies.set('user',email);
      Cookies.set('username',username);
    },
    goHome() {
        this.$router.push({
            name: 'home_index'
        });
    }
  }
};
</script>
