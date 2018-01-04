<style scoped>
    .layout-content-main{
        padding: 10px;
        border: 1px;
        text-align: center;
        color: #9ea7b4;
    }

    .header {
        float: left;
        width: 50%;
        height: 26px;
        text-align: center;
        background-color: #2E363F;
        color: #8B8B8C;
        padding-top: 4px;
    }
</style>
<template>
    <Row ref="mainrow">
        <Col span="17" :xs="3" :sm="7" :md="11" :lg="17">
            <div class="layout-content-main">
                <div class="header" style="border-right: black 2px dotted;">待校对区域总数：{{preCheckTotal}}</div>
                <div class="header">已完成区域总数：{{postCheckTotal}}</div>
            </div>
            <div v-for="(o,i) in splits.rects" style="float: left;">
                <glyph-block :key="i" :imgData="getRectColumn(o)" :rectData="o"
                :active=false @highlight="onHighlight"></glyph-block>
            </div>
        </Col>
        <Col span="7" :xs="21" :sm="17" :md="13" :lg="7">
            <div class="canvas-layout">
                <canvas-op :rects="rects" :imageUrl="image"></canvas-op>
            </div>
        </Col>
    </Row>
</template>
<script>
import canvasOp from './components/canvas_op.vue';
import glyphBlock from './components/glyph_block.vue';
import util from '@/libs/util';
import _ from 'lodash';

export default {
    name: 'bConfidence',
    components: {
        canvasOp,
        glyphBlock, 
    },
    watch: {
        current() {
            let _this = this;
            let _rect = _.find(this.splits.rects, function(n) {return n.x == _this.current.x && n.y == _this.current.y})
            this.rects = this.offset_rects(_rect);
            this.image = _this.getRectColumn(_rect).s3_uri;
        }

    },
    computed: {
        
    },
    data () {
        return {
            current: {},
            preCheckTotal: 100,
            postCheckTotal: 200,
            image: "http://oidgqmecg.bkt.clouddn.com/jiaodui/hint_image.png",
            rects: [],
            splits: {
               "rects": [
                    {
                        "cncode": "GLZ_S00001_R001_T0025_L18",
                        "w": 40,
                        "cn": 18,
                        "word": "氣",
                        "wcc": null,
                        "op": 1,
                        "cc": 0.999999,
                        "x": 317,
                        "id": "eda87c6a-6991-43a8-bfdc-1d99d41f876f",
                        "ts": "",
                        "ln": 5,
                        "h": 32,
                        "y": 525
                    },
                    {
                        "cncode": "GLZ_S00001_R001_T0018_L07",
                        "w": 40,
                        "cn": 7,
                        "word": "氣",
                        "wcc": null,
                        "op": 1,
                        "cc": 0.999993,
                        "x": 797,
                        "id": "5ba9f327-7a5b-4d16-b861-50405f0a51d0",
                        "ts": "",
                        "ln": 5,
                        "h": 39,
                        "y": 639
                    }
                ],
                "ocolumns": [
                    {
                        "s3_uri": "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GLZ/S00001/R001/GLZ_S00001_R001_T0025_L18.jpg",
                        "code": "GLZ_S00001_R001_T0025_L18",
                        "x": "312",
                        "y": "0"
                    },
                    {
                        "s3_uri": "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GLZ/S00001/R001/GLZ_S00001_R001_T0018_L07.jpg",
                        "code": "GLZ_S00001_R001_T0018_L07",
                        "x": "792",
                        "y": "0"
                    }
                ],
                rect_columns: {},
                "task_id": "b0883a29-ab6e-4d31-b748-69e70fa721e8"
            }
        }
    },

    created() {
        // Fetch glyphs data
        // util.ajax.get('/api/cctask/obtain/').then(function(response){
        //     console.log(response);
        // }).catch(function(error){
        //     console.log(error);
        // });
    },

    methods: {
        offset_rects(current_rect) {
            let _this = this;
            let _rect = function(n) {
              let column = _this.getRectColumn(n);
              n.x = n.x - column.x
              return n;
            }
            return _.map(_.cloneDeep([current_rect]), _rect);
        },
        onHighlight(rect) {
            // Pop checking area

            this.current = rect;
            
        },
        getRectColumn(rect) {
            window.mm = this
            let column = this.splits.rect_columns[rect.cncode]
            if (column) { return column; }

            this.splits.rect_columns[rect.cncode] = _.find(this.splits.ocolumns, function(n) { return n.code == rect.cncode});
            return this.splits.rect_columns[rect.cncode];
        },
    }
}
</script>
