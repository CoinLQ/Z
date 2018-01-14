<template>
  <canvas :id="canvasId">
      <keyeventopt :ratio="ratio" @drawnow="update_canvas"></keyeventopt>
      <mouseevtopt :ratio="ratio" :canvasId="canvasId" @drawnow="update_canvas"></mouseevtopt>
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
    props: ["redraw", "ratio"],

    computed: {
        canvasId() {
            return 'canvas-scope';
        }
    },

    watch: {
        redraw() {
            this.redraw_canvas();
        }
    },

    data() {
        return {
        }
    },

    methods: {
        setInitCanvasImage: function(){
            let canvas = document.getElementById('canvas-scope');
            canvas.width = 300;
            canvas.height = window.innerHeight;
            let ctx = canvas.getContext('2d');
            let gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
            gradient.addColorStop(0, '#606E9A');
            gradient.addColorStop(1, '#386093');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, 300, window.innerHeight);
            ctx.strokeStyle='white';
            ctx.font="30px Verdana";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeText("Operate Area", 150, window.innerHeight/2, 300);
            ctx.save();
        },
        redraw_canvas: function() {
            let canvas = document.getElementById('canvas-scope');
            let ctx = canvas.getContext('2d');
            let image = this.$store.getters.image;
            if (image.empty) {
                return ctx.restore();
            }
            this.updateCanvas(image, canvas, ctx);
        },
        updateCanvas: function(image, canvas, ctx) {
            canvas.width = image.width * this.ratio;
            canvas.height = image.height * this.ratio;
            ctx.drawImage(image, 0, 0, image.naturalWidth || image.width, image.naturalHeight || image.height, 0, 0, image.width * this.ratio, image.height * this.ratio);
            this.drawAllRect(ctx);
        },
        drawAllRect: function(ctx){
            let current = this.$store.getters.curRect;
            let rects = this.$store.getters.rects;
            rects.forEach(function(rect,i){
                this.positive_rect(rect);
                if (rect.mselected && rect.kselected) {
                    ctx.strokeStyle="rgba(255,0,255,1)";
                } else if (rect.mselected) {
                    ctx.strokeStyle="rgba(255,0,0,1)";
                } else if (rect.kselected) {
                    ctx.strokeStyle="rgba(255,255,0,1)";
                } else if (rect == current) {
                    ctx.strokeStyle="rgba(0,255,0,1)";
                } else {
                    ctx.strokeStyle="rgba(56,56,255,1)";
                }
                ctx.lineWidth=1.5*this.ratio;
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
        update_canvas: function (current) {
            this.$store.dispatch('setCurRect', {rect: current});
            this.redraw_canvas();
        }
    },
    mounted: function(){
        this.setInitCanvasImage()
    }
};
</script>