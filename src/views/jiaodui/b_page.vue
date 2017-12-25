<style scoped>
    .layout-content-main{
        padding: 10px;
        border: 1px;

    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
</style>
<template>
            <Row ref="mainrow">
                <Col span="17">
                    <div class="layout-content-main">Content</div>
                </Col>
                <Col span="7">
                    <div class="canvas-layout">
                    <canvas ref="canvasBase" id="canvas-scope" :width="canvas_width" :height="canvas_height" v-insert-image="image_url"></canvas>
                    </div>
                </Col>
            </Row>

</template>

<script>
import Cookies from 'js-cookie';
import  _ from 'lodash';

export default {
    name: 'CanvasRect',
    directives: {
        insertImage: {
            function(canvasElement, binding) {
            // Get canvas context
            //var ctx = canvasElement.getContext("2d");
            // Clear the canvas
            // var ctx = canvasElement.getContext("2d");
            // var image = new Image();
            // image.src = binding.value;
            // image.addEventListener("load",function(){
            //     canvasElement.resize_canvas(image, canvasElement)
            // }.bind(canvasElement),false);
            }
        }
    },
    watch: {
        exampleContent() {
            console.log("exampleContent changed to " + this.exampleContent);
        },
    },
    computed: {
        canvas_height(){
                return this.window_height - 103;
        },
        canvas_width() {
            return (this.window_width -200) * 7 /24;
        }
    },
    data () {
//GLZ_S00192_R001_T0007_L01.jpg
//GLZ_S00192_R001_T0007_L06.jpg
//GLZ_S00193_R001_T0012_L01.jpg
//GLZ_S00195_R001_T0001_L06.jpg
//GLZ_S00003_R013_T0008_L01.jpg
        return {
            rects: [{"id":"5e2841f9-e5c0-418c-973e-0e6adea7ee58","line_no":5,"col_no":7,"x":60,"y":155,"width":43,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false},
                {"id":"5e2841f9-e5c0-418c-973e-0e6adea7ee58","line_no":5,"col_no":7,"x":60,"y":198,"width":38,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false}],
            exampleContent: "This is TEXT",
            image_url: "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GLZ/S00001/R491/GLZ_S00001_R491_T0024.jpg",
            //image_url: 'http://dist.zhanghuiyong.cn/media/GLZ_S00193_R001_T0012_L01.jpg',
            current: {},
            window_height: window.innerHeight,
            window_width: window.innerWidth,
            x_ratio: 1.0,
            y_ratio: 1.0,
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
                    if (this.dist(mouse, this.point(rect.x + rect.width, rect.y)) <= this.handle_size) return 'topright';
                    if (this.dist(mouse, this.point(rect.x, rect.y + rect.height)) <= this.handle_size) return 'bottomleft';
                    if (this.dist(mouse, this.point(rect.x + rect.width, rect.y + rect.height)) <= this.handle_size) return 'bottomright';
                    if (this.dist(mouse, this.point(rect.x + rect.width / 2, rect.y)) <= this.handle_size) return 'top';
                    if (this.dist(mouse, this.point(rect.x, rect.y + rect.height / 2)) <= this.handle_size) return 'left';
                    if (this.dist(mouse, this.point(rect.x + rect.width / 2, rect.y + rect.height)) <= this.handle_size) return 'bottom';
                    if (this.dist(mouse, this.point(rect.x + rect.width, rect.y + rect.height / 2)) <= this.handle_size) return 'right';
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
                    if (this.current) {
                        this.draggable = true;
                    } else {
                        this.draggable = false;
                    }
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
                                posHandle.x = rect.x + rect.width;
                                posHandle.y = rect.y;
                                break;
                            case 'bottomleft':
                                posHandle.x = rect.x;
                                posHandle.y = rect.y + rect.height;
                                break;
                            case 'bottomright':
                                posHandle.x = rect.x + rect.width;
                                posHandle.y = rect.y + rect.height;
                                break;
                            case 'top':
                                posHandle.x = rect.x + rect.width / 2;
                                posHandle.y = rect.y;
                                break;
                            case 'left':
                                posHandle.x = rect.x;
                                posHandle.y = rect.y + rect.height / 2;
                                break;
                            case 'bottom':
                                posHandle.x = rect.x + rect.width / 2;
                                posHandle.y = rect.y + rect.height;
                                break;
                            case 'right':
                                posHandle.x = rect.x + rect.width;
                                posHandle.y = rect.y + rect.height / 2;
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
    methods: {
        canvasImage: function(image_url){
            var canvas = this.$refs.canvasBase;
            var ctx = canvas.getContext("2d");
            var image = new Image();
            image.src = image_url;
            image.addEventListener("load",function(){
                var newCanvas = this.resize_canvas(image, canvas, this.$refs.canvasBase2)
            }.bind(this),false);
        },
        resize_canvas: function(img, canvas) {
            function resize(prop1, prop2) {
                void 0 !== canvas[prop1] && void 0 === canvas[prop2] && (canvas[prop2] = img[prop2] / img[prop1] * canvas[prop1]);
            }

            var ctx;
            resize('width', 'height');
            resize('height', 'width');
            ctx = canvas.getContext('2d');
            this.x_ratio = this.drag.x_ratio = canvas.width/(img.naturalWidth || img.width);
            this.y_ratio = this.drag.y_ratio = canvas.height/(img.naturalHeight || img.height);
            console.log(this.x_ratio, this.y_ratio);
            ctx.drawImage(img, 0, 0, img.naturalWidth || img.width, img.naturalHeight || img.height, 0, 0, canvas.width, canvas.height);
            this.drawAllRect()
        },
        drawAllRect: function(){
            var canvas = this.$refs.canvasBase;
            var ctx = canvas.getContext("2d");
            let _this = this;
            this.rects.forEach(function(rect,i){
                if (rect.selected) {
                    ctx.strokeStyle="rgba(255,0,0,1)";
                } else {
                    ctx.strokeStyle="rgba(0,0,0,1)";
                }
                console.log(rect.x, rect.y, rect.width, rect.height)
                ctx.strokeRect(rect.x*_this.x_ratio, rect.y*_this.y_ratio, rect.width*_this.x_ratio, rect.height*_this.y_ratio);
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
              return r.x <= point.x && point.x<=r.x+r.width &&
                     r.y <= point.y && point.y<=r.y+r.height;
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
            this.canvasImage(this.image_url)
        },
    },
    mounted: function(){
        this.canvasImage(this.image_url)
        let _this = this
        window.onresize = _.debounce(() => {
            _this.window_height = document.body.clientHeight;
            _this.window_width = document.body.clientWidth;
            _this.canvasImage(_this.image_url);
        }, 400)
        let target = document.getElementById('canvas-scope')
        target.onselectstart = function(e) { e.preventDefault(); return false; };
        target.onmousedown = function (event) {
            let rect = _this.contains_mouse(event);
            _this.choice_rect(rect)
            console.log(rect);
        };
        target.onmousemove = function (event) {
            window.nn = _this;
            if (_this.current.selected) {
                let point= _this.translat_point(event)
                _this.current.x = point.x;
                _this.current.y = point.y;
                if (event.preventDefault) {
                    event.preventDefault()
                }
                //_.debounce(() => { _this.redraw_canvas(); }, 100)
                _this.redraw_canvas();
                return false
            } else {
                let point= _this.translat_point(event)
                _this.drag.mark_corner(point,_this.rects);
                //let currentHandle = _this.drag.getHandle(point,_this.rects[0]);
                console.log(_this.rects[0].corner);
                console.log(_this.rects[1].corner)
                //_.debounce(() => { _this.redraw_canvas(); }, 100)
                _this.redraw_canvas();
                return false;
            }
        };
        target.onmouseup = function (event) {
            _this.current.selected = false;
            _this.redraw_canvas()
        }

        // window.onresize = function() {
        //     debugger;
        //     this.window_height = window.innerHeight - 103;
        //     this.window_width = (window.innerWidth-200) * 7 /24;
        // };
    }
};
</script>