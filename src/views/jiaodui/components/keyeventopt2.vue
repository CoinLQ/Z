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
    props: ['ratio'],
    data: function () {
        return {
            unit: 5,
            curRect: {},
            rects: []
        };
    },
    mounted: function() {
        console.log('keyevent mounted');
        let _this = this;
        _this.unit = (_this.unit / _this.$store.getters.ratio) |0;
        window.document.body.onkeydown = function(event) {
            let eat=false;
            _this.curRect = _this.$store.getters.curRect;
            _this.rects = _this.$store.getters.rects;
            if (Vue.config.keyCodes.directions.includes(event.keyCode)) {
                if (!event.altKey && !event.shiftKey) {
                    _this.move(event); eat=true;
                } else if (event.altKey) {
                    _this.enlarge(0, event); eat=true;
                } else if (event.shiftKey) {
                    _this.shrink(0, event); eat=true;
                }
            } else if ((event.keyCode == 32) && !event.altKey && !event.ctrlKey) {
                _this.selected(event); eat=true;
            } else if (event.keyCode == 88) {
                if (event.altKey) {
                    _this.enlarge(1, event); eat=true;
                } else if (event.shiftKey) {
                    _this.shrink(1, event); eat=true;
                }
            }
            // if for sure that key combo conflicts with other action, enable event filter.
            // if (event.preventDefault) event.preventDefault();
            if (eat) event.preventDefault();
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
            if(this.curRect.kselected){
                if(d == 'left' && this.curRect.x > this.unit){
                    this.curRect.x -= this.unit;
                }
                else if(d == 'up' && this.curRect.y > this.unit){
                    this.curRect.y -= this.unit;
                }
                else if(d == 'right'){
                    this.curRect.x += this.unit;
                }
                else if(d == 'down'){
                    this.curRect.y += this.unit;
                }
                this.logCurRect('move', d);
            }
            else {
                let next;
                if (d == 'left' || d == 'up') {
                    next = -1;
                } else {
                    next = 1;
                }
                let index = _(this.rects).findIndex({cc: this.curRect.cc}) + next;
                let len = this.rects.length;
                index = index < 0 ? 0 : (index >= len ? len - 1 : index);
                this.curRect = this.rects[index];
            }
            this.redraw_canvas();
        },
        shrink: function (f, ev) { //缩小
            var d = this.direction(ev.keyCode);
            this.logCurRect('shrink', d);
            if(this.curRect.kselected){
                if(f || (d == 'left' && this.curRect.w > this.unit)){
                    this.curRect.w -= this.unit;
                }
                if(f || (d == 'up' && this.curRect.h > this.unit)){
                    this.curRect.h -= this.unit;
                }
                if(f || (d == 'right' && this.curRect.w > this.unit)){
                    this.curRect.w -= this.unit;
                    this.curRect.x += this.unit;
                }
                if(f || (d == 'down' && this.curRect.h > this.unit)){
                    this.curRect.h -= this.unit;
                    this.curRect.y += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('shrink', d);
            }
        },
        enlarge: function (f, ev) { //放大
            var d = this.direction(ev.keyCode);
            this.logCurRect('enlarge', d);
            if(this.curRect.kselected){
                if(f || (d == 'left' && this.curRect.x > this.unit)){
                    this.curRect.x -= this.unit;
                    this.curRect.w += this.unit;
                }
                if(f || (d == 'up' && this.curRect.y > this.unit)){
                    this.curRect.y -= this.unit;
                    this.curRect.h += this.unit;
                }
                if(f || d == 'right'){
                    this.curRect.w += this.unit;
                }
                if(f || d == 'down'){
                    this.curRect.h += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('enlarge', d);
            }
        },
        selected: function (ev) {
            this.logCurRect('selected', this.direction(ev.keyCode));
            if(!this.curRect.kselected){
                this.curRect.kselected = true;  //置为空, 触发watch事件, 释放焦点.
            }
            else {
                this.curRect.kselected = false;
            }
            this.redraw_canvas();
        },
        logCurRect: function (opt, direct) {
            if(this.curRect.kselected){
                console.log(opt+'>>>'+direct+'>>>current{ x: '+this.curRect.x+', y: '+this.curRect.y+', w: '+this.curRect.w+', h: '+this.curRect.h+'}');
            }
            else {
                console.log(opt+'>>>'+direct+'>>>current='+null);
            }
        },
        redraw_canvas: function () {
            this.$emit('drawnow', this.curRect);
        },

    }
}
</script>

<style scoped>

</style>