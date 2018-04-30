<style scoped>
    .layout-content-main {
      padding: 10px;
      border: 1px;
      text-align: center;
      color: #9ea7b4;
    }

    .canvas-layout {
        overflow: scroll;
        text-align: center;
        padding: 4px;
        margin: 10px;
        background-color: #cccccc;
        box-shadow: 0px 0px 3px 3px #363E4E;
        border-radius: 2px;
    }

    .button {
        background-color: #cccccc29;
        border-color: #cccccc;
        margin-top: 5px auto;
        width: 99%;
    }

    .button:hover {
        color: #fff;
        background-color: #2db7f5; /*#19be6b; /*#28a9e4*/
        border-color: #2db7f5; /*#47cb89; /*#4782cb*/
    }

    .switch {
        font-size: 1rem;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        width: 99%;
        margin: 5px;
        display: none;
    }

    .outter-wrapper {
      text-align: center;
    }
</style>
<template>
<div class="outter-wrapper">
  <div class="canvas-layout"  ref="wrapper" :style="{height: getHeight}">
    <div><canvas-op :redraw="updateCanvas" @scrollToRect="scrollToRect"></canvas-op></div>
  </div>
  <div class="switch">
    <Switch v-model="switch1" @on-change="changeSwitch" style="margin: auto 5px;"></Switch>打开覆盖
  </div>
  

  <Button :type="submitType" icon="checkmark-round" long @click="submit" :loading="isBtnLoading">
    <span v-if="!isBtnLoading">{{submitText}}</span>
    <span v-else>进行中</span>
  </Button>
  
  <help></help>
</div>
</template>
<script>
import canvasOp from "./components/canvas_op3.vue";
import util from "@/libs/util";
import help from "./components/help";
import {mapState} from "vuex";

export default {
  name: "bCheckLeak",
  components: {
    canvasOp, help
  },
  data() {
    return {
      switch1: true,
      rects: [],
      page_code: '',
      task_id: '',
      updateCanvas: 1,
      submitType: 'error',
      submitText: '暂存结果',
      isBtnLoading: false
    };
  },
  computed: {
      // Make sure canvas is properly displayed within the window height.
      getHeight: function () {
          return (window.innerHeight - 160) + 'px';
      },
      ...mapState({
        solidRects: state => state.canvas.rects,
        curRect: state => state.canvas.curRect,
      }) 
  },
  watch: {
      curRect(val, oldVal) {
          if (_.filter(this.solidRects, function(o) { return !o.kselmarked }).length != 0) {
              this.submitType = 'error'
          } else {
              this.submitType = 'success';
              this.submitText = '完成任务';
          }
      }
  },
  mounted() {
    this.getWorkingData();
    this.$store.commit('setScale', {scale: 1});
    this.$Notice.config({top: 50, duration: 3});
  },
  beforeDestroy() {
      this.$store.commit('resetAll')
  },
  methods: {
    getWorkingData() {
        let that = this;
        let url = '/api/pagetask/obtain/';

        if (this.$route.params.tid) {
          url = '/api/pagetask/' + this.$route.params.tid + '/';
        }
        that.$Loading.start();
        util.ajax(url).then(function (response) {
            that.$Loading.finish();
            if (response.data.status != 0)
                throw {message: response.data.msg}

            that.task_id = response.data.task_id;
            that.page_code = response.data.page_code;
            that.rects = response.data.rects;
            that.$store.commit('updateBannerHeader', response.data.page_info);
            return util.createImgObjWithUrl(util.getPageImageUrlFromCode(that.page_code));
        }).then(function (event) {
            that.$store.commit('setImageAndRects', {image: event.target, rects: that.rects})
            that.updateCanvas += 1;
        }).catch(function(error) {
            that.$Loading.finish();
            that.$Notice.error({
                title: that.$t('Failed'),
                desc: that.$t(error.message||'')
            });
        });
    },
    submit() {
        if (_.filter(this.solidRects, function(o) { return !o.kselmarked }).length == 0) {
            this.done_submit();
            return;
        }
        let url = '/api/pagetask/' + this.task_id + '/save/';
        let that = this;
        that.$Notice.error({
            title: that.$t('Failed'),
            desc: '还有未处理过的字块，请全部检查处理后再提交！'
        });
        this.isBtnLoading = true;
        document.getElementsByClassName("canvas-layout")[0].focus()
        util.ajax.post(url, {rects: this.solidRects}).then(function (response) {
            let suc = response.data.status == 0;
            if (!suc) {
                throw {message: response.data.msg}
            }
            that.isBtnLoading = false;
            that.$Notice.success({title: '٩(˘◡˘ )', desc: '调整结果暂存成功'});
            
        }).catch(function (error) {
            that.isBtnLoading = false;
            that.$Notice.error({
                title: that.$t('Failed'),
                desc: that.$t(error.message)
            });
        })
    },
    done_submit() {
        let url = '/api/pagetask/' + this.task_id + '/done/';
        let that = this;
        this.isBtnLoading = true;
        document.getElementsByClassName("canvas-layout")[0].focus()
        util.ajax.post(url, {rects: this.solidRects}).then(function (response) {
            let suc = response.data.status == 0;
            if (!suc) {
                throw {message: response.data.msg}
            }
            that.isBtnLoading = false;
            that.$Notice.success({title: '٩(˘◡˘ )', desc: '任务提交成功，自动领取下一任务'});
            if (that.$route.params.tid) {
                that.$router.push({ path: '/mytask/onebyone'});
            } else {
                that.getWorkingData();
            }
        }).catch(function (error) {
            that.isBtnLoading = false;
            that.$Notice.error({
                title: that.$t('Failed'),
                desc: that.$t(error.message)
            });
        })
    },
    scrollToRect() {
      let scale = this.$store.getters.scale;
      let canvas = document.getElementsByClassName('canvas-layout')[0];
      let viewWidth = canvas.clientWidth;
      let viewHeight = canvas.clientHeight -20;
      let offsetTop = canvas.scrollTop;
      let offsetLeft = canvas.scrollLeft;
      
      let rect = this.$store.getters.curRect;
      
      if (rect.y * scale > offsetTop && rect.y * scale + rect.h < offsetTop + viewHeight) {
        if (rect.x * scale > offsetLeft && rect.x * scale + rect.w < offsetLeft + viewWidth) {
          return true
        }
      } 
      
      let x = Math.max(rect.x * scale - (window.innerWidth/3), rect.x);
      let y = Math.max(rect.y * scale - (window.innerHeight/3), rect.y);
      this.$nextTick(function() {
          this.$refs.wrapper.scrollTo(x, y);
      });
      window.wrapper = this.$refs.wrapper;
    },

    changeSwitch() {
      this.$store.commit('setCover', {cover: this.switch1});
      this.updateCanvas += 1;
    }
  }
};
</script>
