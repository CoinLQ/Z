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
        <Col span="17" :xs="3" :sm="7" :md="11" :lg="15">
            <div class="layout-content-main">
                <div class="header" style="border-right: black 2px dotted;">待校对区域总数：{{preCheckTotal}}</div>
                <div class="header">已完成区域总数：{{postCheckTotal}}</div>
            </div>
            <div v-for="(o,i) in splits.rects" style="float: left;">
                <glyph-block :key="i" :imgData="getImgObj(o, splits.ocolumns)" :rectData="o"
                :active=false @highlight="onHighlight"></glyph-block>
            </div>
        </Col>
        <Col span="7">
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
    name: 'bClassify',
    components: {
        canvasOp,
        glyphBlock,
    },
    data () {
        return {
            preCheckTotal: 100,
            postCheckTotal: 200,
            image: "https://s3.cn-north-1.amazonaws.com.cn/lqcharacters-images/GLZ/S00001/R001/GLZ_S00001_R001_T0025_L18.jpg",
            rects: [{"id":"5e2841f9-e5c0-418c-973e-0e6adea7ee58","line_no":5,"col_no":7,"x":60,"y":155,"width":43,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false},
                    {"id":"5e2841f9-e5c0-418c-973e-0e6adea2ee58","line_no":5,"col_no":7,"x":60,"y":198,"width":38,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false}],
                    
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
        onHighlight() {
            // Pop checking area
            
        },

        getImgObj(rect, imgs) {
            let img_id = rect.cncode;
            let obj = null;
            _(imgs).forEach(function(i){
                if (i.code === img_id) {
                    obj = i;
                    return true;
                }
            });

            if (obj) {
                return obj;
            } else {
                throw ("Split data incomplete! Contact data provider.");
            }
        }
    }
}
</script>
