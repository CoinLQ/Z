<style lang="less">
@import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflowY: shrink ? 'visible' : 'auto', overflowX: 'hidden'}">
            <shrinkable-menu
                ref="shrinkmenu"
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../images/logo.png" key="max-logo" />
                    <img class="mini" v-show="shrink" src="../images/logo-min.png" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-content" :style="{left: shrink?'60px':'200px'}">
            <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
                <div class="main-header">
                    <Row type="flex">
                      <Col span="12" class="main-header-left">
                          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '0' : '0') + 'deg)'}" type="text" @click="toggleClick">
                              <!-- <Icon type="navicon" size="28"></Icon> -90 -->
                              <img src="../images/views/列表.png" />
                          </Button>
                          <img src="../images/views/校勘平台.png" class="jiankan-logo"/>
                      </Col>
                      <Col span="12" class="main-header-right">
                        <span class="user-name" v-if="username">欢迎您：{{ username }}</span>
                        <img src="../images/views/用户.png" @click="handleClickUserDropdown('personalCenter')" />
                        <!-- <img src="../images/views/消息.png" />
                        <img src="../images/views/帮助.png" /> -->
                        <img src="../images/views/退出.png" @click="handleClickUserDropdown('loginout')" />
                      </Col>
                      <!-- <div class="navicon-con">
                      </div>
                      <div class="user-dropdown-menu-con" :style="{padding: '4px'}">
                          <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                              <Icon type="ios-person-outline" size="32" style="margin-right: 8px;"></Icon>
                              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                  <a href="javascript:void(0)">
                                      <span class="main-user-name">{{ username }}</span>
                                      <Icon type="arrow-down-b"></Icon>
                                  </a>
                                  <DropdownMenu slot="list">
                                      <DropdownItem name="personalCenter"><Icon size="28"  type="ios-personadd" style="margin-right: 8px;"></Icon>修改信息</DropdownItem>
                                      <DropdownItem name="loginout" divided><Icon size="28"  type="android-exit" style="margin-right: 8px;"></Icon>退出登录</DropdownItem>
                                  </DropdownMenu>
                              </Dropdown>
                          </Row>
                      </div>
                      <div class="header-avator-con">
                          <message-tip v-show="false" v-model="mesCount"></message-tip>
                          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                      </div> -->
                    </Row>
                    <!-- <Row>
                        <div class="header-middle-con">
                            <div class="main-breadcrumb">
                                <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                            </div>
                        </div>
                    </Row> -->
                </div>
                <div class="tags-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath" ></breadcrumb-nav>

                        <span v-if="bannerHeader != ''" class="ivu-breadcrumb-item-separator">&ndash;</span>
                        <div class='banner-header'>{{bannerHeader}}</div>
                    </div>
                </div>
            </div>
            <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
                <div class="layout">
                    <div class="layout-content" :style="{height: content_height+'px'}">
                    <keep-alive :include="cachePage">
                        <router-view></router-view>
                    </keep-alive>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import themeSwitch from "./main-components/theme-switch/theme-switch.vue";
import Cookies from "js-cookie";
import { mapState } from "vuex";
import { on, off } from "iview/src/utils/dom";
import util from "@/libs/util.js";

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip
  },
  data() {
    return {
      topHeight: 95,
      shrink: false,
      content_height: 0,
      email: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    },
    bannerHeader() {
      return this.$store.state.app.banner_header;
    },
    ...mapState({
      username: state => state.app.username
    })
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit("setMessageCount", 3);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name === "personalCenter") {
        util.openNewPage(this, "personalcenter");
        this.$router.push({
          name: "personal_center"
        });
      } else if (name === "loginout") {
        // 退出登录
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.$router.push({
          name: "login"
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // if (name === 'accesstest_index') {
      //     return false;
      // } else {
      //     return true;
      // }
      return true;
    },
    fullscreenChange(isFullScreen) {
      console.log(this.isFullScreen);
    },
    handleResize() {
      if (this.isFullScreen) {
        this.content_height = window.outerHeight - this.topHeight;
      } else {
        this.content_height = window.innerHeight - this.topHeight;
      }
    },
    shield_refresh() {
        var event = event || window.event;
        var keycode = event.keyCode || event.which;
        if(keycode == 116){
            if(event.preventDefault){//chrome、firefox、IE9+
                this.$router.go(0);
                event.preventDefault();
            }else{//IE8-
                event.keyCode = 0;
                event.returnValue = false;
            }
        }
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    }
  },
  mounted() {
    this.init();
    this.content_height = window.innerHeight - this.topHeight;
    on(window, "resize", this.handleResize);
    on(window, "keydown", this.shield_refresh);
  },
  beforeDestroy() {
    off(window, "resize", this.handleResize);
    off(window, "keydown", this.shield_refresh);
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
    this.$store.commit("refressh_token");
  }
};
</script>