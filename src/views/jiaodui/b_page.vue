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

</style>
<template>
<div>
<div class="canvas-layout" :style="{height: getHeight}">
  <div><canvas-op :redraw="updateCanvas"></canvas-op></div>
</div>
<div class="button-wrapper"><Button type="success" size="large" shape="circle" long @click="submit" :loading="isBtnLoading" icon="checkmark-round">
    <span v-if="!isBtnLoading">提交</span>
    <span v-else>进行中</span>
</Button></div>
</div>
</template>
<script>
import canvasOp from "./components/canvas_op3.vue";
import util from "@/libs/util";

export default {
  name: "bPage",
  components: {
    canvasOp
  },
  data() {
    return {
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
        {
          x: 146,
          y: 385,
          w: 85,
          h: 72,
          cc: "0.966675",
          word: "驟",
          ln: 2,
          cn: 1,
          pcode: "GLZ_S00001_R001_T0002"
        },
        {
          x: 237,
          y: 303,
          w: 89,
          h: 80,
          cc: "0.997873",
          word: "探",
          ln: 1,
          cn: 2,
          pcode: "GLZ_S00001_R001_T0002"
        },
        {
          x: 249,
          y: 384,
          w: 71,
          h: 71,
          cc: "0.958889",
          word: "賾",
          ln: 2,
          cn: 2,
          pcode: "GLZ_S00001_R001_T0002"
        }
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
      let that = this;
    //   this.isBtnLoading = true;
    //   util.ajax
    //     .post("/api/cctask/done", {})
    //     .then(function(response) {
    //       // that.$Notice.success({
    //       //     title: '',
    //       //     desc: ''
    //       // });
    //       that.isBtnLoading = false;
    //       that.getWorkingData();
    //     })
    //     .catch(function(error) {
    //       that.isBtnLoading = false;
    //       that.$Notice.error({
    //         title: "Something went wrong.",
    //         desc: error.message
    //       });
    //     });
        let a = this.$store.getters.curRect;
        that.$Notice.error({
            title: "Something went wrong.",
            desc: 'asdf' + a.x
          });
          a.x = 1000;

          that.$Notice.error({
            title: "Something went wrong.",
            desc: this.$store.getters.curRect.x
          });
    }
  }
};
</script>
