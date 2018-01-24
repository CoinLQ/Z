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
    }

    .button {
        background-color: #cccccc29;
        border-color: #cccccc;
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
    }
</style>
<template>
<div>
  <div class="canvas-layout"  ref="wrapper" :style="{height: getHeight}">
    <div><canvas-op :redraw="updateCanvas" @scrollToRect="scrollToRect"></canvas-op></div>
  </div>
  <div class="switch">
    <Switch v-model="switch1" @on-change="changeSwitch" style="margin: auto 5px;"></Switch>打开覆盖
  </div>
  <div class="button-wrapper">
    <Button type="info" size="large" shape="circle" class="button" long @click="submit" :loading="isBtnLoading" icon="checkmark-round">
      <span v-if="!isBtnLoading">提交</span>
      <span v-else>进行中</span>
    </Button>
  </div>
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
      rects: [
        {
          x: 143,
          y: 302,
          w: 90,
          h: 73,
          cc: "0.99369",
          word: "馳",
          ln: 1,
          cn: 1,
          pcode: "GLZ_S00001_R001_T0002"
        },
        // {
        //   x: 146,
        //   y: 385,
        //   w: 85,
        //   h: 72,
        //   cc: "0.966675",
        //   word: "驟",
        //   ln: 2,
        //   cn: 1,
        //   pcode: "GLZ_S00001_R001_T0002"
        // },
        // {
        //   x: 237,
        //   y: 303,
        //   w: 89,
        //   h: 80,
        //   cc: "0.997873",
        //   word: "探",
        //   ln: 1,
        //   cn: 2,
        //   pcode: "GLZ_S00001_R001_T0002"
        // },
        // {
        //   x: 249,
        //   y: 384,
        //   w: 71,
        //   h: 71,
        //   cc: "0.958889",
        //   word: "賾",
        //   ln: 2,
        //   cn: 2,
        //   pcode: "GLZ_S00001_R001_T0002"
        // }
      ],
      image_url:
        "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GZ/000790/v001/GZ000790v001p00010.jpg",
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
    this.getWorkData();
    this.$store.commit('setScale', {scale: 1});
  },
  methods: {
    getWorkData() {
      util.createImgObjWithUrl(this.image_url).then(
          function(v) {
            this.$store.commit('setImageAndRects', {image: v.target, rects: this.rects})
            this.updateCanvas += 1;
          }.bind(this)
        ).catch(function(v) {
          console.log("Image failed to load! " + v);
        });
    },
    submit() {
    },

    scrollToRect() {
      let scale = this.$store.getters.scale;
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
