<template>
    <input id="event_receiver" 
           @keydown.up.down.left.right.prevent.exact="move"
           @keydown.alt.up.down.left.right.prevent.exact="fill_out(0, $event)"
           @keydown.shift.up.down.left.right.prevent.exact="diminish(0, $event)"
           @keydown.space.prevent.exact="selected"
           @keydown.alt.all.prevent.exact="fill_out(1, $event)"
           @keydown.shift.all.prevent.exact="diminish(1, $event)"
                />
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
};

export default {
    name: 'optkeyevent',
    props: ['current'],
    data: function () {
        return {
            target: null,
            unit: 5
        };
    },
    mounted: function() {
        console.log('mounted1');
        this.target = document.getElementById('event_receiver');
    },
    watch: {
        current: function (val, oldval) {
            console.log('watch current:'+val+'>'+this.target+ ", this.unit="+this.unit);
            this.logCurRect();
            if(val){ //选中
                this.target.focus();
                console.log('focus');
            }
            else { //释放
                this.target.blur();
            }
        }
    },
    methods: {
        direction: function (code) {
            var keyCodes = Vue.config.keyCodes;
            for(var key in keyCodes){
                if(keyCodes[key] instanceof Array && keyCodes[key].includes(code)){
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
                if(f || (d == 'left' && this.current.width > this.unit)){
                    this.current.x += this.unit;
                    this.current.width -= this.unit;
                }
                if(f || (d == 'up' && this.current.height > this.unit)){
                    this.current.y += this.unit;
                    this.current.height -= this.unit;
                }
                if(f || (d == 'right' && this.current.width > this.unit)){
                    this.current.width -= this.unit;
                }
                if(f || (d == 'down' && this.current.height > this.unit)){
                    this.current.height -= this.unit;
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
                    this.current.width += this.unit;
                }
                if(f || (d == 'up' && this.current.y > this.unit)){
                    this.current.y -= this.unit;
                    this.current.height += this.unit;
                }
                if(f || d == 'right'){
                    this.current.width += this.unit;
                }
                if(f || d == 'down'){
                    this.current.height += this.unit;
                }
                this.redraw_canvas();
                this.logCurRect('fill_out', d);
            }
        },
        selected: function (ev) {
            this.logCurRect('selected', this.direction(ev.keyCode));
            if(this.current){
                this.current = null;  //置为空, 触发watch事件, 释放焦点.
                //todo 向父组件发送 释放信号.
            }
            else {
                //this.current = {};
            }
        },
        logCurRect: function (opt, direct) {
            if(this.current){
                console.log(opt+'>>>'+direct+'>>>current{ x: '+this.current.x+', y: '+this.current.y+', w: '+this.current.width+', h: '+this.current.height+'}');
            }
            else {
                console.log(opt+'>>>'+direct+'>>>current='+null);
            }
        },
        redraw_canvas: function () {
            this.$emit('drawnow');
        }
    }
}
</script>

<style scoped>

</style>