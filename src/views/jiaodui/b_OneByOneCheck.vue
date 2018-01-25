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
  <Button type="info" size="large" icon="checkmark-round" class="button" long @click="submit" :loading="isBtnLoading">
    <span v-if="!isBtnLoading">提交</span>
    <span v-else>进行中</span>
  </Button>
  <help></help>
</div>
</template>
<script>
import canvasOp from "./components/canvas_op3.vue";
import util from "@/libs/util";
import help from "./components/help";

export default {
  name: "bCheckLeak",
  components: {
    canvasOp, help
  },
  data() {
    return {
      switch1: false,
      rects: [],
      page_id: '',
      task_id: '',
      updateCanvas: 1,
      isBtnLoading: false
    };
  },
  computed: {
      // Make sure canvas is properly displayed within the window height.
      getHeight: function () {
          return window.innerHeight + 'px';
      }
  },
  mounted() {
    this.getWorkingData();
    this.$store.commit('setScale', {scale: 1});
  },
  methods: {
    getWorkingData() {
        let that = this;
        let url = '/api/pagetask/obtain/';

        if (this.$route.params.tid) {
          url = '/api/pagetask/' + this.$route.params.tid + '/';
        }
        util.ajax(url).then(function (response) {
            if (response.data.status != 0)
                throw {message: response.data.msg}

            that.page_id = response.data.page_id;
            that.task_id = response.data.task_id;
            that.rects = response.data.rects;
            return util.createImgObjWithUrl(util.getImageUrlFromCode(that.page_id));
        }).then(function (event) {
            that.$store.commit('setImageAndRects', {image: event.target, rects: that.rects})
            that.updateCanvas += 1;
        }).catch(function(error) {
            that.$Notice.error({
                title: 'Failed',
                desc: error.message || ''
            });
        });
    },
    submit() {
        let url = '/api/pagetask/' + this.task_id + '/done/';
        let that = this;
        let r = this.$store.getters.solidRects;

        this.isBtnLoading = true;
        util.ajax.post(url, {rects: r}).then(function (response) {
            let suc = response.data.status == 0;
            if (!suc) {
                throw {message: response.data.msg}
            }
            that.isBtnLoading = false;
            that.$Notice.success({title: 'success', desc: ''});
            that.getWorkingData();
        }).catch(function (error) {
            that.isBtnLoading = false;
            that.$Notice.error({
                title: 'Failed',
                desc: error.message
            });
        })
    },

    scrollToRect() {
      let scale = this.$store.getters.scale;

      if (scale == 1) return;

      let rect = this.$store.getters.curRect;
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
