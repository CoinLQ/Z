<template>
  <canvas id="canvas-scope">
      <keyeventopt :current="current" v-on:drawnow="toDrawNow" v-on:releasenow="release_current"></keyeventopt>
  </canvas>
</template>

<script>
import Cookies from 'js-cookie';
import  _ from 'lodash';
import keyeventopt from "./keyeventopt2.vue";

export default {
    components: {keyeventopt},
    name: 'canvasOp',
    props: {
      rects: {},
      img: {},
      ratio: Number
    },
    computed: {
        canvas() {
            return document.getElementById('canvas-scope');
        },

        ctx() {
            return this.canvas.getContext('2d');
        }
    },
    watch: {
        img() {
            this.setCanvasImage();
        },
        rects() {
            if (!_.find(this.rects, function(n){ n.id == this.current.id}.bind(this))){
                    this.current = this.rects[0];
            }
        },
        current() {
            this.$store.commit('setNewRect', {rect:this.current});
        }
    },
    data () {
        return {
            last_img: null,
            current: {},
            draw: {
                drawing: false,
                additions: [],
                enable: false,
            },
            drag: {
                current: null,
                draggable: false,
                handle_size: 3,
                point: function(x, y) { return {x: x, y: y} },
                dist: function (p1, p2) {
                    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
                    },
                getHandle: function (mouse, rect) {
                    if (this.dist(mouse, this.point(rect.x, rect.y)) <= this.handle_size) return 'topleft';
                    if (this.dist(mouse, this.point(rect.x + rect.w, rect.y)) <= this.handle_size) return 'topright';
                    if (this.dist(mouse, this.point(rect.x, rect.y + rect.h)) <= this.handle_size) return 'bottomleft';
                    if (this.dist(mouse, this.point(rect.x + rect.w, rect.y + rect.h)) <= this.handle_size) return 'bottomright';
                    if (this.dist(mouse, this.point(rect.x + rect.w / 2, rect.y)) <= this.handle_size) return 'top';
                    if (this.dist(mouse, this.point(rect.x, rect.y + rect.h / 2)) <= this.handle_size) return 'left';
                    if (this.dist(mouse, this.point(rect.x + rect.w / 2, rect.y + rect.h)) <= this.handle_size) return 'bottom';
                    if (this.dist(mouse, this.point(rect.x + rect.w, rect.y + rect.h / 2)) <= this.handle_size) return 'right';
                    return false;
                },
                mark_corner: function(mouse, rects) {
                    if (this.current) {
                        this.current.corner = false;
                    }
                    var rect = _.find(rects, function(r) {
                        let corner = this.getHandle(mouse, r)
                        if (corner) {
                            r.corner = corner;
                        }
                        return corner;
                    }.bind(this));
                    this.current = rect;
                },
                clear_corner: function(rects) {
                    rects.forEach(function(rect, i){
                        rect.corner = false
                    })
                    this.draggable = false;
                },
                draw_corner: function(ctx, rect) {
                    if (rect.corner) {
                        let posHandle = this.point(0, 0);
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
                        ctx.arc(posHandle.x * this.ratio, posHandle.y * this.ratio, this.handle_size, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                },

            }
        };
    },
    methods: {
        setCanvasImage: function(){
            let image = this.last_img = new Image();
            image.src = this.img.s3_uri;
            image.addEventListener("load",function(){
                this.redraw_canvas();
            }.bind(this),false);
        },
        redraw_canvas: function() {
            this.$store.commit('setNewRect', {rect:this.current});

            let canvas = this.canvas;
            let image = this.last_img;
            let ctx = this.ctx;
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
                this.drag.draw_corner(ctx, rect);
            }, this);

        },
        translat_point: function(event) {
            var ev = event || window.event; //Moz || IE
            let mouse = {x: 0 ,y : 0}
            if (ev.pageX) { //Moz
                mouse.x = ev.pageX;
                mouse.y = ev.pageY;
            } else if (ev.clientX) { //IE
                mouse.x = ev.clientX;
                mouse.y = ev.clientY;
            }
            let documentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let documentScrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
            let offsety = this.canvas.getBoundingClientRect().top+documentScrollTop;
            let offsetx = this.canvas.getBoundingClientRect().left+documentScrollLeft;
            let yy = (mouse.y-offsety)/this.ratio;
            let xx = (mouse.x-offsetx)/this.ratio;
            return {x: xx, y: yy}
        },
        contains_mouse: function(event) {
            let point= this.translat_point(event)
            var rect = _.find(this.rects, function(r) {
                return r.x <= point.x && point.x<=r.x+r.w &&
                    r.y <= point.y && point.y<=r.y+r.h;
            });
            return rect;
        },
        choice_rect: function(rect) {
            if (!rect) {
                return
            }
            window.nn = this;
            if (this.current.id) {
                this.current.selected = false;
            }
            this.current = rect;
            this.current.selected = true;
            this.redraw_canvas()
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
        toDrawNow: function () {
            console.log('222toDrawNow');
            this.redraw_canvas();
        },
        release_current: function() {
            this.current = {};
            this.redraw_canvas();
        },
    },
    mounted: function(){
        this.setCanvasImage()
        this.canvas.onselectstart = function(e) { e.preventDefault(); return false; };
        this.canvas.onmousedown = function (event) {
            if (this.drag.current && this.drag.current.corner) {
                this.drag.draggable = true;
            } else {
                let rect = this.contains_mouse(event);
                this.choice_rect(rect);

                console.log(1);
                if (!rect && this.draw.enable) {
                    this.draw.drawing = true;
                    let mouse= this.translat_point(event);
                    let new_rect = Object.assign({}, this.rects[0]);
                    new_rect.id = '';
                    new_rect.hans = '';
                    new_rect.confidence = 1.0;
                    new_rect.x = mouse.x;
                    new_rect.y = mouse.y;
                    new_rect.w = 5;
                    new_rect.h = 5;
                    this.draw.additions.push(new_rect)
                    this.rects.push(new_rect);
                }
            }
        }.bind(this);
        this.canvas.onmousemove = function (event) {
            window.nn = this;
            if (this.draw.drawing) {
                let point= this.translat_point(event)
                let _new = this.draw.additions[this.draw.additions.length-1]
                _new.w = point.x - _new.x;
                _new.h = point.y - _new.y;
                this.redraw_canvas();
                _.debounce(() => {  this.draw.drawing = false; this.redraw_canvas(); }, 100)
            }
            else if (this.drag.draggable) {
                let rect = this.drag.current;
                let mouse= this.translat_point(event);
                switch (this.drag.current.corner) {
                    case 'topleft':
                        rect.w += rect.x - mouse.x;
                        rect.h += rect.y - mouse.y;
                        rect.x = mouse.x;
                        rect.y = mouse.y;
                        break;
                    case 'topright':
                        rect.w = mouse.x - rect.x;
                        rect.h += rect.y - mouse.y;
                        rect.y = mouse.y;
                        break;
                    case 'bottomleft':
                        rect.w += rect.x - mouse.x;
                        rect.x = mouse.x;
                        rect.h = mouse.y - rect.y;
                        break;
                    case 'bottomright':
                        rect.w = mouse.x - rect.x;
                        rect.h = mouse.y - rect.y;
                        break;

                    case 'top':
                        rect.h += rect.y - mouse.y;
                        rect.y = mouse.y;
                        break;

                    case 'left':
                        rect.w += rect.x - mouse.x;
                        rect.x = mouse.x;
                        break;

                    case 'bottom':
                        rect.h = mouse.y - rect.y;
                        break;

                    case 'right':
                        rect.w = mouse.x - rect.x;
                        break;
                }
                this.redraw_canvas();
                _.debounce(() => {  this.drag.draggable = false; this.drag.current = none; this.redraw_canvas(); }, 100)
            }
            else if (this.current.selected) {
                let point= this.translat_point(event)
                this.current.x = point.x;
                this.current.y = point.y;
                this.redraw_canvas();

            } else {
                let point= this.translat_point(event)
                this.drag.mark_corner(point,this.rects);
                this.redraw_canvas();
                return false;
            }
            if (event.preventDefault) {
                event.preventDefault()
            }
            return false
        }.bind(this);
        this.canvas.onmouseup = function (event) {
            if (this.drag.draggable) {
                this.drag.draggable = false;
            } else if (this.current.selected){
                this.current.selected = false;
            }
            this.draw.drawing = false;

            this.redraw_canvas()
        }.bind(this);

    }
};
</script>