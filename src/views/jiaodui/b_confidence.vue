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
        overflow: hidden;
    }

    .canvas-layout {
        overflow: scroll;
        text-align: center;
    }
</style>
<template>
<div class="layout">
    <Content>
        <Row ref="mainrow">
            <Col span="17" :xs="5" :sm="9" :md="12" :lg="19">
                <Row>
                <div class="layout-content-main">
                    <div class="header" style="border-right: black 2px dotted;">待校对区域总数：{{preCheckTotal}}</div>
                    <div class="header">已完成区域总数：{{postCheckTotal}}</div>
                </div>
                <div v-for="r in splits.rects" style="float: left;">
                    <glyph-block :imgData="getRectColumn(r)" :rectData="r" :active=false @highlight="onHighlight"></glyph-block>
                </div>
                </Row>
                <Row type="flex" align="bottom" justify="center">
                    <Button type="success" size="large" shape="circle" style="width:98%;" long @click="submit" :loading="isBtnLoading" icon="checkmark-round">
                        <span v-if="!isBtnLoading">提交</span>
                        <span v-else>进行中</span>
                    </Button>
                </Row>
            </Col>
            <Col span="7" :xs="19" :sm="15" :md="12" :lg="5">
                <div ref="wrapper" class="canvas-layout" :style="{height: getHeight}">
                    <div><canvas-op :redraw="updateCanvas" :ratio="ratio"></canvas-op></div>
                </div>
            </Col>
        </Row>
    </Content>
</div>
</template>

<script>
import canvasOp from './components/canvas_op2.vue';
import glyphBlock from './components/glyph_block.vue';
import util from '@/libs/util';
import _ from 'lodash';

export default {
    name: 'bConfidence',
    components: {
        canvasOp,
        glyphBlock,
    },
    computed: {
        // Make sure canvas is properly displayed within the window height.
        getHeight: function () {
            return window.innerHeight - 100 + 'px';
        }
    },
    data () {
        return {
            isBtnLoading: false,
            ratio: 4, // magnified factor
            preCheckTotal: 100,
            postCheckTotal: 200,
            updateCanvas: 1,
            splits: {}
        }
    },

    mounted() {
        this.getWorkingData();
    },

    methods: {
        getWorkingData() {
        // Fetch glyphs data
        // util.ajax.get('/api/cctask/obtain/').then(function(response){
        //     console.log(response);
        //      this.splits = response.data;
        // }).catch(function(error){
        //     console.log(error);
        //      this.$Notice.error({
            //     title: 'Something went wrong.',
            //     desc: error.message
            // });
        // });
            this.$store.commit('resetAll');

            this.splits = {
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
            };
        },

        onHighlight(item) {
            this.updateCanvas +=1;

            // Make sure show the exact part of canvas
            this.$refs.wrapper.scrollTo(0, Math.abs(item.rect.y * this.ratio - (window.innerHeight/2)));
        },

        getRectColumn(rect) {
            let column = this.splits.rect_columns[rect.cncode]
            if (column) { return column; }

            this.splits.rect_columns[rect.cncode] = _.find(this.splits.ocolumns, function(n) { return n.code == rect.cncode});
            return this.splits.rect_columns[rect.cncode];
        },

        submit() {
            let that = this;
            this.isBtnLoading = true;
            util.ajax.post('/api/cctask/done', {})
            .then(function(response){
                // that.$Notice.success({
                //     title: '',
                //     desc: ''
                // });
                that.isBtnLoading = false;
                that.getWorkingData();

            })
            .catch(function (error) {
                that.isBtnLoading = false;
                that.$Notice.error({
                    title: 'Something went wrong.',
                    desc: error.message
                });
            })
        },

        collectRects() {
            // Collect rects from glyph-blocks
        }
    }
}
</script>
