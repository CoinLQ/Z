<style scoped>
    .layout-content-main {
      padding: 10px;
      border: 1px;
      text-align: center;
      color: #9ea7b4;
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
    .ivu-btn.ivu-btn-text.ivu-btn-large {
        color: grey;
    }
</style>
<template>
<div class="outter-wrapper">
  <div class="canvas-layoutA"  ref="wrapper">
    <div><canvas-op :redraw="updateCanvas" @scrollToRect="scrollToRect"></canvas-op></div>
  </div>
  <div class="switch">
    <Switch v-model="switch1" @on-change="changeSwitch" style="margin: auto 5px;"></Switch>打开覆盖
  </div>
  
  <Row>
        <Col span="12">
            <Button type="error" icon="checkmark-round" long @click="submit" :loading="isBtnLoading">
                <span v-if="!isBtnLoading">保存结果</span>
                <span v-else>进行中</span>
            </Button>
        </Col>
        <Col span="12">
            <Button type="success" :disabled="status == 7" icon="checkmark-round" long @click="confirm_modal = true" :loading="isBtnLoading">
                <span v-if="!isBtnLoading">完成任务</span>
                <span v-else>进行中</span>
            </Button>
        </Col>
        <Modal
        v-model="confirm_modal"
        title="任务提交确认"
        @on-ok="done_submit"
        @on-cancel="">
        <p>此任务提交后，将无法再次提交</p>
        <p>是否确认提交？</p>
    </Modal>
  </Row>

  
  <help></help>
</div>
</template>
<script>

import canvasOp from "./components/canvas_op3.vue";
import util from "@/libs/util";
import help from "./components/help";
import {mapState} from "vuex";

import bus from '@/bus';

export default {
  name: "bCheckLeak",
  components: {
    canvasOp, help
  },
  data() {
    return {
      confirm_modal: false,

      status: 0,
      switch1: true,
      rects: [],
      current: {},
      task_id: '',
      updateCanvas: 1,
      submitType: 'error',
      isBtnLoading: false,
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
          }
      }
  },
  mounted() {
    this.getWorkingData();
    this.$store.commit('setScale', {scale: 1});
    this.$Notice.config({top: 50, duration: 3});
   },
  methods: {

    getWorkingData() {
        let that = this;
        let url = '/api/pagetask/obtain/';

        if (this.$route.params.id) {
          url = '/api/pagetask/' + this.$route.params.id + '/';
        }
        that.$Loading.start();
        util.ajax(url).then(function (response) {
            that.$Loading.finish();
            that.status = response.data.status;
            that.task_id = response.data.task_id;
            that.image_url = response.data.image_url;
            that.rects = response.data.rects;
            that.$store.commit('updateBannerHeader', response.data.page_info);
            that.current = _.find(that.rects, function(r) { return r.x == response.data.current_x && r.y == response.data.current_y}) || that.current;
            return util.createImgObjWithUrl(that.image_url);
        }).then(function (event) {
            that.$store.commit('setImageAndRects', {image: event.target, rects: that.rects})
            that.$store.commit('setCurRect', {rect: that.current});
            that.updateCanvas += 1;
        }).catch(function(error) {
            that.$Loading.finish();
            that.$Notice.error({
                title: that.$t('Failed'),
                desc: that.$t(error.message || '')
            });
        });
    },
    submit() {
        let url = '/api/pagetask/' + this.task_id + '/save/';
        let that = this;
        // that.$Notice.error({
        //     title: that.$t('Failed'),
        //     desc: '还有未处理过的字块，请全部检查处理后再提交！'
        // });
        this.isBtnLoading = true;
        document.getElementsByClassName("canvas-layoutA")[0].focus()
        let r = _.forEach(_.cloneDeep(_.filter(this.solidRects, function(o) { return o.kselmarked })), function (item) {
            if (item.deleted) {item.op = 3;} else if (item.changed) { item.op = 2;}
        })
        util.ajax.post(url, {rects: r, current_x: this.curRect.x, current_y: this.curRect.y}).then(function (response) {
            let suc = response.data.status == 0;
            if (!suc) {
                throw { message: response.data.msg }
            }
            that.isBtnLoading = false;
            that.$Notice.success({title: '随喜', desc: '切分校对保存成功'});
            that.getWorkingData();
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
        document.getElementsByClassName("canvas-layoutA")[0].focus()
        let r = _.forEach(_.cloneDeep(this.solidRects), function (item) {
            if (item.deleted) item.op = 3;
        })
        util.ajax.post(url, {rects: r, current_x: this.curRect.x, current_y: this.curRect.y}).then(function (response) {
            let suc = response.data.status == 0;
            if (!suc) {
                throw {message: response.data.msg}
            }
            that.isBtnLoading = false;
            that.$Notice.success({title: '随喜', desc: '任务提交成功，自动领取下一任务'});
            that.$router.push({ path: '/collate_tasks/pagetask'});
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
      let canvas = document.getElementsByClassName('canvas-layoutA')[0];
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
    },

  }
};
</script>
