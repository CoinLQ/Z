<template>
  <canvas :id="canvasId">
      <KeyEventOpt></KeyEventOpt>
      <MouseEventOpt :canvasId="canvasId" @drawnow="update_canvas"></MouseEventOpt>
  </canvas>
</template>

<script>
import  _ from 'lodash';
import Cookies from 'js-cookie';
import util from '@/libs/util'
import KeyEventOpt from "./keyEventOpt3";
import MouseEventOpt from "./mouseEventOpt3";
import bus from '@/bus';

// http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

export default {
    name: 'canvasOp',
    components: {KeyEventOpt, MouseEventOpt},

    props: ["redraw"],

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
            ctx.font="30px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.strokeText("Operate Area", 0, 0);
            ctx.save();
        },
        redraw_canvas: function() {
            let canvas = document.getElementById('canvas-scope');
            let ctx = canvas.getContext('2d');
            let image = this.$store.getters.image;
            let scale = this.$store.getters.scale;
            if (image.empty) {
                return ctx.restore();
            }
            this.updateCanvas(image, canvas, ctx, scale);
        },
        updateCanvas: function(image, canvas, ctx, scale) {
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            ctx.drawImage(image, 0, 0, image.naturalWidth || image.width, image.naturalHeight || image.height, 0, 0, image.width * scale, image.height * scale);
            this.drawAllRect(ctx, scale);
        },
        drawAllRect: function(ctx, scale){
            let current = this.$store.getters.curRect;
            let rects = this.$store.getters.rects;
            let cover = this.$store.getters.cover;
            window.rects = rects;
            _(rects).forEach(function(rect,i){
                ctx.lineWidth=1.5*scale;
                ctx.globalAlpha = 0.5;
                if (rect.mselected) {
                    ctx.strokeStyle="#1892e8bf"; // blue
                    ctx.fillStyle = '#1892e8a0';
                } else if (rect.kselected) {
                    ctx.strokeStyle="#e8e818bf"; // yellow // #e32764e6
                    ctx.fillStyle = '#e8e818a0';
                } else if (rect == current) {
                    ctx.strokeStyle="#2aa766"; //green //"#2aa366";
                    ctx.fillStyle = '#2aa766a0';
                } else {
                    rect.red = rect.red || util.getRed();
                    ctx.strokeStyle=rect.red;
                    ctx.fillStyle = '#0000';
                }

                if (cover) {
                    ctx.fillStyle = '#BEB7ADE0';
                }

                if (rect.deleted || rect.op == 3) {
                    ctx.fillStyle = '#000000a0';
                    ctx.lineWidth=4*scale;
                }

                ctx.strokeRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);
                ctx.fillRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);

                this.draw_corner(ctx, rect, scale);
            }.bind(this));

            let refRects = this.$store.getters.refRects;
            _(refRects).forEach(function(rect,i){
                rect.red = rect.red || util.getRed();
                ctx.lineWidth=1.5*scale;
                ctx.strokeStyle=rect.red;
                ctx.strokeRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);
            }.bind(this));
        },

        draw_corner: function(ctx, rect, scale) {
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
                ctx.arc(posHandle.x * scale, posHandle.y * scale, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        },
        update_canvas: function (current) {
            this.redraw_canvas();
        },
        handleKeyEvent: function (event) {
            if (event.type == 'keydown')
                this.$store.dispatch('handleKeyDownEvent', event);
            else if (event.type == 'keyup')
                this.$store.dispatch('handleKeyUpEvent', event);

            this.redraw_canvas();
            this.$emit('scrollToRect');
        },
    },
    mounted: function(){
        this.setInitCanvasImage()
        bus.$on('keyEvent', this.handleKeyEvent);
    }
};
</script>
