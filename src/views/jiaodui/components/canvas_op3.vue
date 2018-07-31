<style scoped>
.canvas-layout {
overflow: scroll;
text-align: center;
padding: 4px;
margin: 10px;
background-color: #cccccc;
box-shadow: 0px 0px 3px 3px #363E4E;
border-radius: 2px;
}
</style>

<template>
    <div class="row">
        <div class="col-lg-11 canvas-layout" :style="{height: this.inner_height}">
            <canvas :id="canvasId"  >
                <KeyEventOpt></KeyEventOpt>
                <MouseEventOpt :canvasId="canvasId" @drawnow="update_canvas"></MouseEventOpt>
            </canvas>
        </div>
        <el-button-group class="col-lg-1">
            <el-button plain size="mini" icon="el-icon-minus" @click="scaleSmall" round></el-button>
            <el-button plain size="mini" round>1:{{$store.getters.scale}}</el-button>
            <el-button plain size="mini" icon="el-icon-plus" @click="scaleBig" round></el-button>
        </el-button-group>
    </div>
</template>

<script>
import Vue from 'vue';
import  _ from 'lodash';
import Cookies from 'js-cookie';
import util from '@/libs/util'
import KeyEventOpt from "./keyEventOpt3";
import MouseEventOpt from "./mouseEventOpt3";
import bus from '@/bus';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { on, off } from 'iview/src/utils/dom';

Vue.use(ElementUI);

// http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

export default {
    name: 'canvasOp',
    components: {KeyEventOpt, MouseEventOpt},
    props: ["redraw"],
    data:function(){
        return {
            scales:[0.25,0.5,1,2,3,4,5,6,7,8,9],
            inner_height: 100,
        };
    },

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
        strokeColorA:function(){ return "#eb00d6";},
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
                
                if (rect.deleted || rect.op == 3) {
                    ctx.fillStyle = '#000000a0';
                    ctx.lineWidth=4*scale;
                } else if (rect.changed || rect.op == 2) {
                    ctx.strokeStyle="#00ff00"; //green
                    ctx.fillStyle = '#0000';
                    ctx.lineWidth= 2*scale;
                } else {
                    rect.red = rect.red || util.getRed();
                    ctx.strokeStyle=this.strokeColorA();
                    ctx.fillStyle = '#0000';
                    ctx.lineWidth=2*scale;
                }
                if (rect.kselected) {
                    ctx.strokeStyle="#db6161bf"; // green // #e32764e6
                    ctx.fillStyle = '#db6161a0';
                    if (rect.deleted) {
                        ctx.fillStyle = '#000000a0';
                    }
                } else if (rect == current) {
                    ctx.strokeStyle = "#1892e8bf"; // blue
                    ctx.fillStyle = '#1892e8a0';
                    if (rect.deleted) {
                        ctx.fillStyle = '#000000a0';
                    }
                    ctx.lineWidth=1*scale;
                    var originCorner=rect.corner;
                    ['topleft','topright','top','left','right','bottomleft','bottom','bottomright'].forEach(function (corner) {
                        rect.corner=corner;
                        this.draw_corner(ctx,rect,scale);
                    }.bind(this));
                    rect.corner=originCorner;
                }

                ctx.strokeRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);
                ctx.fillRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);

                this.draw_corner(ctx, rect, scale);
            }.bind(this));

            let refRects = this.$store.getters.refRects;
            _(refRects).forEach(function(rect,i){
                rect.red = rect.red || util.getRed();
                ctx.lineWidth=2*scale;
                ctx.strokeStyle=this.strokeColorA();
                ctx.strokeRect(rect.x*scale, rect.y*scale, rect.w*scale, rect.h*scale);
            }.bind(this));
        },

        draw_corner: function(ctx, rect, scale) {
            if (rect.corner) {
                // console.log("draw_corner:"+rect);
                ctx.fillStyle = "#FF0000";
                var bottomColor="#000000";
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

                    case 'top':
                        posHandle.x = rect.x + rect.w / 2;
                        posHandle.y = rect.y;
                        break;
                    case 'left':
                        posHandle.x = rect.x;
                        posHandle.y = rect.y + rect.h / 2;
                        break;
                    case 'right':
                        posHandle.x = rect.x + rect.w;
                        posHandle.y = rect.y + rect.h / 2;
                        break;

                    case 'bottomleft':
                        posHandle.x = rect.x;
                        posHandle.y = rect.y + rect.h;
                        ctx.fillStyle = bottomColor;
                        break;
                    case 'bottomright':
                        posHandle.x = rect.x + rect.w;
                        posHandle.y = rect.y + rect.h;
                        ctx.fillStyle = bottomColor;
                        break;
                    case 'bottom':
                        posHandle.x = rect.x + rect.w / 2;
                        posHandle.y = rect.y + rect.h;
                        ctx.fillStyle = bottomColor;
                        break;
                }

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
        scaleSmall:function(){
            let curIndex=this.scales.indexOf(this.$store.getters.scale);
            let newIndex=Math.max(0,curIndex-1);
            this.updateScale(this.scales[newIndex])
        },
        scaleBig:function(){
            let curIndex=this.scales.indexOf(this.$store.getters.scale);
            let newIndex=Math.min(this.scales.length-1,curIndex+1);
            this.updateScale(this.scales[newIndex])
        },
        updateScale:function (newScale) {
            // console.log("new Scale:"+newScale);
            let action="scale-";
            if(newScale==0.25){
                action+="3"
            }else if(newScale==0.5){
                action+="2"
            }else {
                action+=newScale
            }
            bus.$emit('keyEvent', {type: "keydown", action: action, modify:{ctrlKey:newScale<1}})
        },
        handleResize() {
            this.inner_height = (window.innerHeight - 200) + 'px';
            console.log("inner-height:"+this.inner_height);
        },
    },
    mounted: function(){
        this.setInitCanvasImage()
        bus.$on('keyEvent', this.handleKeyEvent);

        this.handleResize();
        on(window, 'resize', this.handleResize);
    },
    beforeDestroy() {
        this.$store.commit('resetAll')
        off(window, 'resize', this.handleResize);
    },
};
</script>
