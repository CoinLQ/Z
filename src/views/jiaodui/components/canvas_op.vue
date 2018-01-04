<template>
  <canvas id="canvas-scope"
          :width="canvas_width"
          :height="canvas_height">
      <keyeventopt :current="current" v-on:drawnow="toDrawNow" v-on:releasenow="release_current"></keyeventopt>
  </canvas>
</template>

<script>
import Cookies from 'js-cookie';
import  _ from 'lodash';
import keyeventopt from "./keyeventopt.vue";

export default {
    components: {keyeventopt},
    name: 'canvasOp',
    props: {
      rects: {},
      imageUrl: String,
    },
    computed: {
        canvas_height(){
            return this.window_height - this.topHeight;
        },
        canvas_width() {
            return (this.window_width -200) * 7 /24;
        }
    },
    watch: {
        imageUrl() {
            this.redraw_canvas();
        },
        rects() {
            if (!_.find(this.rects, function(n){ n.id == this.current.id}.bind(this))){
                    this.current = this.rects[0];
            }
        },
    },
    data () {
        return {
            topHeight: 103,
            current: {},
            unit:5,
            target: null, //canvas Dom元素, 在mounted时赋值.
            window_height: window.innerHeight,
            window_width: window.innerWidth,
            x_ratio: 1.0,
            y_ratio: 1.0,
            draw: {
                drawing: false,
                additions: [],
                enable: false,
            },
            drag: {
                current: null,
                draggable: false,
                x_ratio: 1.0,
                y_ratio: 1.0,
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
                    let _this = this;
                    if (this.current) {
                        this.current.corner = false;
                    }
                    var rect = _.find(rects, function(r) {
                        let corner = _this.getHandle(mouse, r)
                        if (corner) {
                            r.corner = corner;
                        }
                        return corner;
                    });
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
                        ctx.arc(posHandle.x * this.x_ratio, posHandle.y * this.y_ratio, this.handle_size, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                },

            }
        };
    },
    mounted: function () {
        this.current = this.rects[0];
    },
    methods: {
        canvasImage: function(){
            var canvas = document.getElementById('canvas-scope');
            var ctx = canvas.getContext("2d");
            var image = new Image();
            image.src = this.imageUrl;
            image.addEventListener("load",function(){
                this.resize_canvas(image, canvas)
            }.bind(this),false);
        },
        resize_canvas: function(img, canvas) {
            function resize(prop1, prop2) {
                void 0 !== canvas[prop1] && void 0 === canvas[prop2] && (canvas[prop2] = img[prop2] / img[prop1] * canvas[prop1]);
            }
            resize('width', 'height');
            resize('height', 'width');
            var ctx = canvas.getContext('2d');
            this.x_ratio = this.drag.x_ratio = canvas.width/(img.naturalWidth || img.width);
            this.y_ratio = this.drag.y_ratio = canvas.height/(img.naturalHeight || img.height);
            ctx.drawImage(img, 0, 0, img.naturalWidth || img.width, img.naturalHeight || img.height, 0, 0, canvas.width, canvas.height);
            this.drawAllRect();
        },
        drawAllRect: function(){
            var canvas = document.getElementById('canvas-scope');
            var ctx = canvas.getContext("2d");
            let _this = this;
            this.rects.forEach(function(rect,i){
                _this.positive_rect(rect);
                if (rect.selected) {
                    ctx.strokeStyle="rgba(255,0,0,1)";
                } else if (rect == _this.current) {
                    ctx.strokeStyle="rgba(0,255,0,1)";
                } else {
                    ctx.strokeStyle="rgba(56,56,255,1)";
                }
                ctx.strokeRect(rect.x*_this.x_ratio, rect.y*_this.y_ratio, rect.w*_this.x_ratio, rect.h*_this.y_ratio);
                _this.drag.draw_corner(ctx, rect);
            });

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
            let offsety = document.querySelector("#canvas-scope").getBoundingClientRect().top+documentScrollTop;
            let offsetx = document.querySelector("#canvas-scope").getBoundingClientRect().left+documentScrollLeft;
            let yy = (mouse.y-offsety)/this.y_ratio;
            let xx = (mouse.x-offsetx)/this.x_ratio;
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
        redraw_canvas: function() {
            this.canvasImage()
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
        this.canvasImage()
        let _this = this
        window.onresize = _.debounce(() => {
            _this.window_height = document.body.clientHeight;
            _this.window_width = document.body.clientWidth;
            _this.canvasImage();
        }, 100)
        this.target = document.getElementById('canvas-scope');
        this.target.onselectstart = function(e) { e.preventDefault(); return false; };
        this.target.onmousedown = function (event) {
            if (_this.drag.current && _this.drag.current.corner) {
                _this.drag.draggable = true;
            } else {
                let rect = _this.contains_mouse(event);
                _this.choice_rect(rect);

                console.log(1);
                if (!rect && _this.draw.enable) {
                    _this.draw.drawing = true;
                    let mouse= _this.translat_point(event);
                    let new_rect = Object.assign({}, _this.rects[0]);
                    new_rect.id = '';
                    new_rect.hans = '';
                    new_rect.confidence = 1.0;
                    new_rect.x = mouse.x;
                    new_rect.y = mouse.y;
                    new_rect.w = 5;
                    new_rect.h = 5;
                    _this.draw.additions.push(new_rect)
                    _this.rects.push(new_rect);
                }
            }
        };
        this.target.onmousemove = function (event) {
            window.nn = _this;
            if (_this.draw.drawing) {
                let point= _this.translat_point(event)
                let _new = _this.draw.additions[_this.draw.additions.length-1]
                _new.w = point.x - _new.x;
                _new.h = point.y - _new.y;
                _this.redraw_canvas();
                _.debounce(() => {  _this.draw.drawing = false; _this.redraw_canvas(); }, 100)
            }
            else if (_this.drag.draggable) {
                let rect = _this.drag.current;
                let mouse= _this.translat_point(event);
                switch (_this.drag.current.corner) {
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
                _this.redraw_canvas();
                _.debounce(() => {  _this.drag.draggable = false; this.drag.current = none; _this.redraw_canvas(); }, 100)
            }
            else if (_this.current.selected) {
                let point= _this.translat_point(event)
                _this.current.x = point.x;
                _this.current.y = point.y;
                _this.redraw_canvas();

            } else {
                let point= _this.translat_point(event)
                _this.drag.mark_corner(point,_this.rects);
                _this.redraw_canvas();
                return false;
            }
            if (event.preventDefault) {
                event.preventDefault()
            }
            return false
        };
        this.target.onmouseup = function (event) {
            if (_this.drag.draggable) {
                _this.drag.draggable = false;
            } else if (_this.current.selected){
                _this.current.selected = false;
            }
            _this.draw.drawing = false;

            _this.redraw_canvas()
        };

    }
};
</script>