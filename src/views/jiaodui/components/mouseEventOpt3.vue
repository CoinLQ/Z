<style scoped></style>
<template></template>


<script>
import  _ from 'lodash';

export default {
	props:["canvasId"],

    computed: {
        canvas() {
            return document.getElementById(this.canvasId);
        }
    },

	data() {
		return {
            current: {},
            draw: {
                drawing: false,
                additions: null,
                enable: true,
            },
            drag: {
                current: null,
                draggable: false,
                handle_size: 5,
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
                        if (r.deleted) return false;

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
            }

		}
	},
    methods: {
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
            let scale = this.$store.getters.scale;
            let documentScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            let documentScrollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
            let offsety = this.canvas.getBoundingClientRect().top+documentScrollTop;
            let offsetx = this.canvas.getBoundingClientRect().left+documentScrollLeft;
            let yy = (mouse.y-offsety)/scale;
            let xx = (mouse.x-offsetx)/scale;
            return {x: xx, y: yy}
        },
        getRectOverByPoint: function(point, rects) {
            return _.find(rects, function(r) {
                if (r.deleted) return false;

                let dx = point.x - r.x;
                let dy = point.y - r.y;
                return 0 <= dx && dx<=r.w &&
                    0 <= dy && dy<=r.h;
            });
        },
        markRectSelected: function(rect, point) {
            if (!rect) {
                return;
            }
            window.nn = this;
            // if (this.current.id) {
                this.current.mselected = false;
            // }
            this.current = rect;
            this.current.mselected = true;
            this.current.$ = point;
            this.$store.commit('setCurRect',{rect: this.current});
        },
        redraw_canvas() {
            this.$emit('drawnow', this.current);
            this.$store.commit('correctCurRect');
            this.$store.commit('updateItemRect');
        }
    },
    mounted: function(){
        let _this = this;
        _this.canvas.onselectstart = function(e) { e.preventDefault(); return false; };
        _this.canvas.onmousedown = function (event) {
            let rects = _this.$store.getters.rects;
            if (_this.drag.current && _this.drag.current.corner) {
                _this.drag.draggable = true;
            } else {
                let point= _this.translat_point(event)
                let rect = _this.getRectOverByPoint(point, rects);
                _this.markRectSelected(rect, point);
                window.dd = _this;
                console.log("mouse key pressed");
                if (!rect && _this.draw.enable) {
                    _this.draw.drawing = true;
                    let new_rect = Object.assign({}, rects[0]);
                    new_rect.id = '';
                    new_rect.x = point.x -5;
                    new_rect.y = point.y -5;
                    new_rect.w = 5;
                    new_rect.h = 5;
                    new_rect.op = 4;
                    new_rect.cc = 0.5;
                    new_rect.ch = '';
                    new_rect.deleted = false;
                    new_rect.created = true;
                    _this.draw.additions = new_rect;
                    _this.$store.commit('pushRects', {rect:new_rect});
                }
            }
            _this.redraw_canvas()
        };
        _this.canvas.onmousemove = _.throttle(function (event) {
            window.nn = _this;
            _this.current = _this.$store.getters.curRect;
            let point= _this.translat_point(event)
            if (_this.draw.drawing) {
                let _new = _this.draw.additions;
                _new.w = point.x - _new.x;
                _new.h = point.y - _new.y;
                _this.redraw_canvas();
                _.debounce(() => {  _this.draw.drawing = false; _this.redraw_canvas(); }, 100)
            }
            else if (_this.drag.draggable) {
                let rect = _this.drag.current;
                switch (_this.drag.current.corner) {
                    case 'topleft':
                        rect.w += rect.x - point.x;
                        rect.h += rect.y - point.y;
                        rect.x = point.x;
                        rect.y = point.y;
                        break;
                    case 'topright':
                        rect.w = point.x - rect.x;
                        rect.h += rect.y - point.y;
                        rect.y = point.y;
                        break;
                    case 'bottomleft':
                        rect.w += rect.x - point.x;
                        rect.x = point.x;
                        rect.h = point.y - rect.y;
                        break;
                    case 'bottomright':
                        rect.w = point.x - rect.x;
                        rect.h = point.y - rect.y;
                        break;

                    case 'top':
                        rect.h += rect.y - point.y;
                        rect.y = point.y;
                        break;

                    case 'left':
                        rect.w += rect.x - point.x;
                        rect.x = point.x;
                        break;

                    case 'bottom':
                        rect.h = point.y - rect.y;
                        break;

                    case 'right':
                        rect.w = point.x - rect.x;
                        break;
                }
                _this.redraw_canvas();
                _.debounce(() => {  _this.drag.draggable = false; _this.drag.current = {}; _this.redraw_canvas(); }, 100)
            }
            else if (_this.current.mselected) {
                // 此情况是将rect拖动到新的位置
                _this.current.x += point.x - _this.current.$.x;
                _this.current.y += point.y - _this.current.$.y;
                _this.current.$.x = point.x;
                _this.current.$.y = point.y;
                _this.redraw_canvas();

            } else {
                _this.drag.mark_corner(point, _this.$store.getters.rects);
                _.debounce(() => {  _this.drag.current.corner = false; console.log('mark corner'); _this.redraw_canvas(); }, 100)
                _this.redraw_canvas();
                return false;
            }
            if (event.preventDefault) {
                event.preventDefault()
            }
            return false
        }, 100);
        _this.canvas.onmouseup = function (event) {
            if (_this.drag.draggable) {
                _this.drag.draggable = false;
            } else if (_this.current.mselected){
                _this.current.mselected = false;
            }

            if (_this.draw.drawing) {
                let r = _this.draw.additions;
                if (r.w * r.h <= 25) {
                    _this.$store.commit('pullRect', {rect: r});
                } else {
                    _this.$store.commit('setCurRect', {rect: r});
                }
            }
            _this.draw.drawing = false;

            _this.redraw_canvas()
        };

        // _this.canvas.onmousewheel = _.throttle(function (event) {

        //         let ctrlPressed = _this.$store.getters.ctrlPressed;
        //         // console.dir(event)
        //         console.log('in throttle wheel ctrl ' + ctrlPressed);

        //         if (!ctrlPressed) return

        //         let forward = 0
        //         if (event.wheelDeltaY < 0)
        //             forward = -1;
        //         else if (event.wheelDeltaY > 0)
        //             forward = 1;
        //         else
        //             return

        //         _this.$store.commit('setScaleForward', {forward: forward})

        //         _this.redraw_canvas();

        //         event.preventDefault();
        //     }, 100);
    }
}
</script>
