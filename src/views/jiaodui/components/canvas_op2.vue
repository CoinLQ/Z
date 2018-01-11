<template>
  <canvas :id="canvasId">
      <keyeventopt :ration="ratio" @drawnow="update_canvas" v-on:releasenow="release_current"></keyeventopt>
      <mouseevtopt :canvasId="canvasId" @updatecanvas="update_canvas"></mouseevtopt>
  </canvas>
</template>

<script>
import  _ from 'lodash';
import Cookies from 'js-cookie';
import util from '@/libs/util'
import keyeventopt from "./keyeventopt2";
import mouseevtopt from "./mouseeventop2";

export default {
    name: 'canvasOp',
    components: {keyeventopt, mouseevtopt},

    // Canvas accepts 3 parameters to show marks of [rect] on {image} to the ratio scale of size.
    props: ["canvasdata", "ratio"],

    computed: {
        canvasId() {
            return 'canvas-scope';
        }
    },

    watch: {
        canvasdata () {
            this.rects = this.canvasdata.rects;
            this.image = this.canvasdata.image;
            // Used for showing large number of rects
            if (!_.find(this.rects, function(n){ n.id == this.current.id}.bind(this))){
                    this.current = this.rects[0];
            }
            this.$store.commit('setRatio', {ratio: this.ratio});
            this.$store.commit('setRects', {rects: this.rects});
            this.$store.dispatch('setCurRect', {rect: this.current});
            this.redraw_canvas();
        }
    },

    data () {
        return {
            rects: [],
            image: null,
            current: {},
        };
    },

    methods: {
        setInitCanvasImage: function(){
            this.image = new Image();
            this.image.crossOrigin = "*";
            this.image.onload = function(evt){
                this.redraw_canvas();
            }.bind(this);

            this.image.src = "http://oidgqmecg.bkt.clouddn.com/jiaodui/hint_image.png";
        },
        redraw_canvas: function() {
            let canvas = document.getElementById('canvas-scope');
            let ctx = canvas.getContext('2d');
            this.updateCanvas(this.image, canvas, ctx);
        },
        updateCanvas: function(image, canvas, ctx) {
            canvas.width = image.width * this.ratio;
            canvas.height = image.height * this.ratio;
            ctx.drawImage(image, 0, 0, image.naturalWidth || image.width, image.naturalHeight || image.height, 0, 0, image.width * this.ratio, image.height * this.ratio);
            this.drawAllRect(ctx);
        },
        drawAllRect: function(ctx){
            this.rects.forEach(function(rect,i){
                this.positive_rect(rect);
                if (rect.selected) {
                    ctx.strokeStyle="rgba(255,0,0,1)";
                } else if (rect == this.current) {
                    ctx.strokeStyle="rgba(0,255,0,1)";
                } else {
                    ctx.strokeStyle="rgba(56,56,255,1)";
                }
                ctx.lineWidth=1.2*this.ratio;
                ctx.strokeRect(rect.x*this.ratio, rect.y*this.ratio, rect.w*this.ratio, rect.h*this.ratio);
                this.draw_corner(ctx, rect);
            }, this);
        },

        positive_rect: function(rect) {
            if (rect.w<0) {
                rect.x = rect.x + rect.w
                rect.w = Math.abs(rect.w)
            }
            if (rect.h<0) {
                rect.y = rect.y + rect.h
                rect.h = Math.abs(rect.h)
            }
            if (rect.w <5) {
                rect.w = 5;
            }
            if (rect.h <5){
                rect.h = 5;
            }
        },

        draw_corner: function(ctx, rect) {
            if (rect.corner) {
                let posHandle = {x:0, y:0};
                switch (rect.corner) {
                    case 'topleft':
                        posHandle.x = rect.x;
                        posHandle.y = rect.y;
                        break;
                    case 'topright':
                        posHandle.x = rect.x + rect.w;
                        posHandle.y = rect.y;
                        break;
                    case 'bottomleft':
                        posHandle.x = rect.x;
                        posHandle.y = rect.y + rect.h;
                        break;
                    case 'bottomright':
                        posHandle.x = rect.x + rect.w;
                        posHandle.y = rect.y + rect.h;
                        break;
                    case 'top':
                        posHandle.x = rect.x + rect.w / 2;
                        posHandle.y = rect.y;
                        break;
                    case 'left':
                        posHandle.x = rect.x;
                        posHandle.y = rect.y + rect.h / 2;
                        break;
                    case 'bottom':
                        posHandle.x = rect.x + rect.w / 2;
                        posHandle.y = rect.y + rect.h;
                        break;
                    case 'right':
                        posHandle.x = rect.x + rect.w;
                        posHandle.y = rect.y + rect.h / 2;
                        break;
                }
                ctx.fillStyle = "#FF0000";
                ctx.beginPath();
                ctx.arc(posHandle.x * this.ratio, posHandle.y * this.ratio, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        },
        release_current: function() {
            this.current = {};
            this.$store.dispatch('setCurRect', {rect: this.current});
            this.redraw_canvas();
        },
        update_canvas: function (current) {
            this.current = current;
            this.$store.dispatch('setCurRect', {rect: this.current});
            this.redraw_canvas();
        }
    },
    mounted: function(){
        this.setInitCanvasImage()
    }
};
</script>