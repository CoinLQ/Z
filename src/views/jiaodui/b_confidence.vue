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
                    <div><canvas-op :rects="rects" :img="image" :ratio="ratio"></canvas-op></div>
                </div>
            </Col>
        </Row>
    </Content>
</div>
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
            this.image = _this.getRectColumn(_rect);
        }
    },
    computed: {
        getHeight: function () {
            return window.innerHeight - 100 + 'px';
        }
    },
    data () {
        return {
            isBtnLoading: false,
            ratio: 4, // magnified factor
            current: {},
            preCheckTotal: 100,
            postCheckTotal: 200,
            image: {"s3_uri": "http://oidgqmecg.bkt.clouddn.com/jiaodui/hint_image.png"},
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
        },

        offset_rects(current_rect) {
            return _.map(_.cloneDeep([current_rect]), function(n) {
              let column = this.getRectColumn(n);
              n.x = n.x - column.x; // Calculate the offset of x to the image.
              return n;
            }.bind(this));
        },

        onHighlight(rect) {
            this.current = rect;
            this.$refs.wrapper.scrollTo(0, Math.abs(rect.y * this.ratio - (window.innerHeight/2)));
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
        }
    }
}
</script>
