<template>
</template>

<script>
import Vue from 'vue';

Vue.config.keyCodes = {
    up: [38, 87],   //上, W
    left: [37, 65], //左, A
    down: [40, 83], //下, S
    right: [39, 68],  //右, D
    //ctrl: 17, //shift:16 //alt: 18, //meta|windows: 91, //space: 32,
    shift: 16,   //缩小
    alt: 18,    //放大
    space: 32,   //选中
    all: 88,  //X 执行所有方向 X
    directions: [38, 87, 37, 65, 40, 83, 39, 68]
};

export default {
    name: 'optkeyevent',
    props: ['current'],
    data: function () {
        return {
            unit: 5,
            cur: this.current
        };
    },
    mounted: function() {
        console.log('mounted1');
        let _this = this;
        window.document.body.onkeydown = function(event) {
            if (_this.cur) {
                // 操作区键盘事件
                if (Vue.config.keyCodes.directions.includes(event.keyCode)) {
                    if (!event.altKey && !event.shiftKey) {
                        _this.move(event);
                    } else if (event.altKey) {
                        _this.enlarge(0, event);
                    } else if (event.shiftKey) {
                        _this.shrink(0, event);
                    }
                } else if ((event.keyCode == 32) && !event.altKey && !event.ctrlKey) {
                    _this.selected(event);
                } else if (event.keyCode == 88) {
                    if (event.altKey) {
                        _this.enlarge(1, event);
                    } else if (event.shiftKey) {
                        _this.shrink(1, event);
                    }
                }
            } else {
                // TODO：字块区键盘事件处理, release后控制字块区的选中
            }

        }
    },
    watch: {
    },
    methods: {
        direction: function (code) {
            var keyCodes = Vue.config.keyCodes;
            for(var key in keyCodes){
                if((keyCodes[key] instanceof Array) && keyCodes[key].includes(code)){
                    return key;
                }
            }
            return '';
        },
        move: function (ev) { //移到
            var d = this.direction(ev.keyCode);
            this.logCurRect('move', d);
            if(this.cur){
                if(d == 'left' && this.cur.x > this.unit){
                    this.cur.x -= this.unit;
                }
                else if(d == 'up' && this.cur.y > this.unit){
                    this.cur.y -= this.unit;
                }
                else if(d == 'right'){
                    this.cur.x += this.unit;
                }
                else if(d == 'down'){
                    this.cur.y += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('move', d);
            }
            return false;
        },
        shrink: function (f, ev) { //缩小
            var d = this.direction(ev.keyCode);
            this.logCurRect('shrink', d);
            if(this.cur){
                if(f || (d == 'left' && this.cur.w > this.unit)){
                    this.cur.x += this.unit;
                    this.cur.w -= this.unit;
                }
                if(f || (d == 'up' && this.cur.h > this.unit)){
                    this.cur.y += this.unit;
                    this.cur.h -= this.unit;
                }
                if(f || (d == 'right' && this.cur.w > this.unit)){
                    this.cur.w -= this.unit;
                }
                if(f || (d == 'down' && this.cur.h > this.unit)){
                    this.cur.h -= this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('shrink', d);
            }
        },
        enlarge: function (f, ev) { //放大
            var d = this.direction(ev.keyCode);
            this.logCurRect('enlarge', d);
            if(this.cur){
                if(f || (d == 'left' && this.cur.x > this.unit)){
                    this.cur.x -= this.unit;
                    this.cur.w += this.unit;
                }
                if(f || (d == 'up' && this.cur.y > this.unit)){
                    this.cur.y -= this.unit;
                    this.cur.h += this.unit;
                }
                if(f || d == 'right'){
                    this.cur.w += this.unit;
                }
                if(f || d == 'down'){
                    this.cur.h += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('enlarge', d);
            }
        },
        selected: function (ev) {
            this.logCurRect('selected', this.direction(ev.keyCode));
            if(this.cur){
                this.cur = null;  //置为空, 触发watch事件, 释放焦点.
                this.$emit('releasenow');
                //todo 向父组件发送 释放信号.
            }
            else {
                //this.cur = {};
            }
        },
        logCurRect: function (opt, direct) {
            if(this.cur){
                console.log(opt+'>>>'+direct+'>>>current{ x: '+this.cur.x+', y: '+this.current.y+', w: '+this.cur.w+', h: '+this.cur.h+'}');
            }
            else {
                console.log(opt+'>>>'+direct+'>>>current='+null);
            }
        },
        redraw_canvas: function () {            
            this.$emit('drawnow');
            this.$store.commit('setNewRect', this.cur);            
        },

    }
}
</script>

<style scoped>

</style>