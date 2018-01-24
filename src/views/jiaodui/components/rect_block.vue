<style type="text/css" scoped>
</style>

<template>
  <div style="display: flex;">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script type="text/javascript">
import util from '@/libs/util';
import _ from 'lodash';

  export default {
    name: 'RectBlock',

    props: [
      'rectData',
    ],
    // rectData
    // {
        //     "id": "5881eb66-476a-4699-b2bb-9c88d9728cc2",
        //     "op": 3,
        //     "x": 248,
        //     "y": 641,
        //     "w": 36,
        //     "h": 26,
        //     "ocolumn_uri": "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GZ/000790/v058/GZ000790v058p0004019.jpg",
        //     "ocolumn_x": 245,
        //     "ocolumn_y": 0,
        //     "ch": "十",
        //     "rect_id": "2415f8b2-dd02-4ee3-aaf9-72e3c7bdbe5a",
        //     "result": 0,
        //     "created_at": "2018-01-23T10:26:09.609065Z",
        //     "updated_at": "2018-01-23T10:26:09.609104Z",
        //     "modifier": "9c0299ca-4c79-4e6a-bd14-1be46c95b6c7",
        //     "verifier": null,
        //     "del_task": "DelTask_00001C0"
        // },

    mounted() {
        this.initd();
    },

    methods: {
      initd: function() {
        let canvas = this.$refs.canvas;
        let ctx = canvas.getContext('2d');

        let deltaX = this.rectData.x-this.rectData.ocolumn_x;

        let imgRect = {
          x: 0,
          y: this.rectData.y - deltaX,
          w: this.rectData.w + 2*deltaX,
          h: this.rectData.h + 2*deltaX
        }

        let rect = {x: deltaX, y: deltaX, w: this.rectData.w, h: this.rectData.h};

        util.createImgObjWithUrl(this.rectData.ocolumn_uri)
        .then(function(v){
          let w = Math.min(imgRect.w, v.target.width);
          let h = Math.min(imgRect.h, v.target.height);
          let xscale = 120 / w;
          let yscale = 120 / h;

          canvas.width = 120;
          canvas.height = 120;

          ctx.drawImage(v.target, imgRect.x, imgRect.y, w, h, 0, 0, 120, 120);

          ctx.strokeStyle = util.getRed();
          ctx.lineWidth=2;
          ctx.strokeRect(rect.x * xscale, rect.y * yscale, rect.w * xscale, rect.h * yscale);
        }.bind(this))
        .catch(function(v) {
          console.log(v);
        })
      }
    }
  }
</script>
