<style scoped></style>
<template></template>


<script>
import  _ from 'lodash';

export default {
	props:["canvasId", "drawEnable"],

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
                enable: this.drawEnable != "false",
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
                getNearestCorner: function (mouse, rect) {
                    let distance=this.dist(mouse, this.point(rect.x, rect.y));
                    if (distance <= this.handle_size) return {type:'topleft',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x + rect.w, rect.y));
                    if ( distance<= this.handle_size) return {type:'topright',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x, rect.y + rect.h));
                    if ( distance<= this.handle_size) return {type:'bottomleft',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x + rect.w, rect.y + rect.h));
                    if (  distance<= this.handle_size) return {type:'bottomright',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x + rect.w / 2, rect.y))
                    if ( distance<= this.handle_size) return {type:'top',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x, rect.y + rect.h / 2))
                    if ( distance<= this.handle_size) return {type:'left',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x + rect.w / 2, rect.y + rect.h))
                    if ( distance<= this.handle_size) return {type:'bottom',dist:distance};

                    distance=this.dist(mouse, this.point(rect.x + rect.w, rect.y + rect.h / 2))
                    if ( distance<= this.handle_size) return {type:'right',dist:distance};
                    return false;
                },
                mark_corner: function(mouse, rects) {
                    if (this.current) {
                        this.current.corner = false;
                    }
                    var minRect=null;
                    for(var i=0;i<rects.length;i++){
                        var r=rects[i];
                        if (r.deleted)  continue;
                        var cornerInfo=this.getNearestCorner(mouse,r);
                        if(i==0){
                            minRect=rects[0];
                            minRect.cornerInfo=cornerInfo;
                        } else if(cornerInfo &&
                            (!minRect.cornerInfo || cornerInfo.dist<minRect.cornerInfo.dist)
                        ){
                            minRect=r;
                            minRect.cornerInfo=cornerInfo;
                        }
                    }
                    // console.log("mark_corner:");
                    // console.log(minRect);
                    // var rect = _.find(rects, function(r) {
                    //     if (r.deleted) return false;
                    //
                    //     let corner = this.getHandle(mouse, r)
                    //     if (corner) {
                    //         r.corner = corner;
                    //     }
                    //     return corner;
                    // }.bind(this));
                    minRect.corner=minRect.cornerInfo.type;
                    this.current = minRect;
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
            return {x: ~~xx, y: ~~yy}
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
            this.current = rect;
            if (this.current && this.current.id) {
                this.current.mselected = false;
            }else {
                //this.current.mselected = true;
                this.current.kselmarked = true;
            }
            
            
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

                if (!rect && _this.draw.enable) {
                    _this.draw.drawing = true;
                    let new_rect = Object.assign({}, rects[0]);
                    new_rect.id = '';
                    new_rect.x = point.x;
                    new_rect.y = point.y;
                    _this.draw.additions = new_rect;
                    _this.$store.commit('startNewRect', {rect:new_rect});
                }
            }
            _this.redraw_canvas()
        };
        _this.canvas.onmousemove = _.throttle(function (event) {
            _this.current = _this.$store.getters.curRect;
            let point= _this.translat_point(event)
            if (_this.draw.drawing) {
                let _new = _this.draw.additions;
                _new.w = point.x - _new.x;
                _new.h = point.y - _new.y;
                _this.redraw_canvas();
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
                rect.kselmarked = true;
                rect.changed = true;
                _this.$store.commit('setCurRect', {rect: rect});
                _this.redraw_canvas();
            }
            else if (_this.current && _this.current.mselected) {
                // 此情况是将rect拖动到新的位置
                _this.current.x += point.x - _this.current.$.x;
                _this.current.y += point.y - _this.current.$.y;
                _this.current.$.x = point.x;
                _this.current.$.y = point.y;
                _this.redraw_canvas();

            } else {
                _this.drag.mark_corner(point, _this.$store.getters.rects);
                _this.redraw_canvas();
            }
            if (event.preventDefault) {
                event.preventDefault()
            }
	    return false;
        }, 100);
        _this.canvas.onmouseup = function (event) {
            if (_this.drag.draggable) {
                _this.drag.draggable = false;
            } else if (_this.current && _this.current.mselected){
                _this.current.mselected = false;
            }

            if (_this.draw.drawing) {
                let r = _this.draw.additions;
                _this.$store.dispatch('closeNewRect', {rect: r, canvas: _this});
                _this.$nextTick(function(){
                    let point= this.translat_point(event)
                    let rect = this.getRectOverByPoint(point, rects);
                    this.markRectSelected(rect, point);
                    this.current.mselected = false;
                }.bind(_this))
                
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
