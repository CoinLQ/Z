<style scoped>
    .layout-content-main{
        padding: 10px;
        border: 1px;
        text-align: center;
        color: #9ea7b4;
        display: flex;
    }

    .header {
        width: 50%;
        height: 26px;
        text-align: center;
        background-color: #2E363F;
        /*color: #8B8B8C;*/
        padding-top: 4px;
        overflow: hidden;
        box-shadow: 2px 2px 1px 0px #363E4E;
    }

    .canvas-layout {
        overflow: scroll;
        text-align: center;
        padding: 4px;
        margin: 10px;
        background-color: #cccccc;
        box-shadow: 0px 0px 3px 3px #363E4E;
    }
</style>
<template>
<div class="layout">
    <Row ref="mainrow">
        <Col span="17" :xs="10" :sm="13" :md="15" :lg="18">
            <Row>
                <div class="layout-content-main">
                    <div class="header" style="border-right: 2px dotted #909090">待校对区域总数：{{preCheckTotal}}</div>
                    <div class="header">已完成区域总数：{{postCheckTotal}}</div>
                </div>
            </Row>
            <Row type="flex" justify="start" class="code-row-bg">
                <div v-for="r in rectData">
                    <glyph-block :imgData="getImageData(r)" :rectData="r" :active=false @highlight="onHighlight"></glyph-block>
                </div>
            </Row>
            <Row type="flex" align="bottom" justify="center">
                <Button type="success" size="large" shape="circle" style="width:98%;" long @click="submit" :loading="isBtnLoading" icon="checkmark-round">
                    <span v-if="!isBtnLoading">提交</span>
                    <span v-else>进行中</span>
                </Button>
            </Row>
        </Col>
        <Col span="7" :xs="14" :sm="11" :md="9" :lg="6">
            <Row>
                <div ref="wrapper" class="canvas-layout" :style="{height: getHeight}">
                    <div><canvas-op :redraw="updateCanvas" @scrollToRect="scrollToRect"></canvas-op></div>
                </div>
            </Row>
        </Col>
    </Row>
</div>
</template>

<script>
import canvasOp from './canvas_op3.vue';
import glyphBlock from './glyph_block.vue';
import util from '@/libs/util';
import _ from 'lodash';

export default {
    name: 'confidence',
    props: ['rectData'],

    components: {
        canvasOp,
        glyphBlock,
    },
    computed: {
        // Make sure canvas is properly displayed within the window height.
        getHeight: function () {
            return window.innerHeight + 'px';
        }
    },
    data () {
        return {
            isBtnLoading: false,
            preCheckTotal: 100,
            postCheckTotal: 200,
            updateCanvas: 1,
        }
    },

    mounted() {
        this.$store.commit('resetAll');
        this.$store.commit('setScale', {scale: 6});
    },

    methods: {
        onHighlight(item) {
            this.updateCanvas +=1;

            // Make sure show the exact part of canvas
            this.scrollToRect(item.rect);
        },

        scrollToRect() {
            let scale = this.$store.getters.scale;
            let rect = this.$store.getters.curRect;
            setImmediate(function() {
                this.$refs.wrapper.scrollTo(0, Math.max(rect.y * scale - (window.innerHeight/3), rect.y));
            }.bind(this));
            window.wrapper = this.$refs.wrapper;
        },

        getImageData(rect) {
            let column = rect.column_set;

            column.url = util.getImageUrlFromCode(column.col_id);
            return column;
        },

        submit() {
            let rects = this.$store.getters.rects;
            let deleted = this.$store.getters.delRects;
            let all = [].concat(rects).concat(deleted);

            this.$emit('submit', all);
        },
    }
}
</script>
