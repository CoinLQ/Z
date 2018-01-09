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
            unit: 5
        };
    },
    mounted: function() {
        console.log('mounted1');
        let _this = this;
        window.document.body.onkeydown = function(event) {
            if (_this.current) {
                // 操作区键盘事件
                if (Vue.config.keyCodes.directions.includes(event.keyCode)) {
                    if (!event.altKey && !event.shiftKey) {
                        _this.move(event);
                    } else if (event.altKey) {
                        _this.fill_out(0, event);
                    } else if (event.shiftKey) {
                        _this.diminish(0, event);
                    }
                } else if ((event.keyCode == 32) && !event.altKey && !event.ctrlKey) {
                    _this.selected(event);
                } else if (event.keyCode == 88) {
                    if (event.altKey) {
                        _this.fill_out(1, event);
                    } else if (event.shiftKey) {
                        _this.diminish(1, event);
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
            if(this.current){
                if(d == 'left' && this.current.x > this.unit){
                    this.current.x -= this.unit;
                }
                else if(d == 'up' && this.current.y > this.unit){
                    this.current.y -= this.unit;
                }
                else if(d == 'right'){
                    this.current.x += this.unit;
                }
                else if(d == 'down'){
                    this.current.y += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('move', d);
            }
            return false;
        },
        diminish: function (f, ev) { //缩小
            var d = this.direction(ev.keyCode);
            this.logCurRect('diminish', d);
            if(this.current){
                if(f || (d == 'left' && this.current.w > this.unit)){
                    this.current.x += this.unit;
                    this.current.w -= this.unit;
                }
                if(f || (d == 'up' && this.current.h > this.unit)){
                    this.current.y += this.unit;
                    this.current.h -= this.unit;
                }
                if(f || (d == 'right' && this.current.w > this.unit)){
                    this.current.w -= this.unit;
                }
                if(f || (d == 'down' && this.current.h > this.unit)){
                    this.current.h -= this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('diminish', d);
            }
        },
        fill_out: function (f, ev) { //放大
            var d = this.direction(ev.keyCode);
            this.logCurRect('fill_out', d);
            if(this.current){
                if(f || (d == 'left' && this.current.x > this.unit)){
                    this.current.x -= this.unit;
                    this.current.w += this.unit;
                }
                if(f || (d == 'up' && this.current.y > this.unit)){
                    this.current.y -= this.unit;
                    this.current.h += this.unit;
                }
                if(f || d == 'right'){
                    this.current.w += this.unit;
                }
                if(f || d == 'down'){
                    this.current.h += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('fill_out', d);
            }
        },
        selected: function (ev) {
            this.logCurRect('selected', this.direction(ev.keyCode));
            if(this.current){
                this.current = null;  //置为空, 触发watch事件, 释放焦点.
                this.$emit('releasenow');
                //todo 向父组件发送 释放信号.
            }
            else {
                //this.current = {};
            }
        },
        logCurRect: function (opt, direct) {
            if(this.current){
                console.log(opt+'>>>'+direct+'>>>current{ x: '+this.current.x+', y: '+this.current.y+', w: '+this.current.w+', h: '+this.current.h+'}');
            }
            else {
                console.log(opt+'>>>'+direct+'>>>current='+null);
            }
        },
        redraw_canvas: function () {
            this.$emit('drawnow');
        },

    }
}
</script>

<style scoped>

</style>