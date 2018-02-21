<style scoped>
    .layout-content-main{
        padding: 10px;
        border: 1px;
        text-align: center;
        color: #9ea7b4;
        /*display: flex;*/
        display: none;
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

    .glyph-list {
        display: flex;
        flex-flow: column wrap;
        align-items: flex-start;
        justify-content: flex-start;
        align-content: flex-start;
        overflow: scroll;
    }

    .button-submit {
        background-color: #cccccc29;
        border-color: #cccccc;
        flex-grow: 5;
    }

    .button-abandon {
        background-color: #cccccc29;
        border-color: #cccccc;
    }

    .button-submit:hover {
        color: #fff;
        background-color: #2db7f5; /*#19be6b; /*#28a9e4*/
        border-color: #2db7f5; /*#47cb89; /*#4782cb*/
    }

   .button-abandon:hover {
        color: #fff;
        background-color: #f90; /*#19be6b; /*#28a9e4*/
        border-color: #f90; /*#47cb89; /*#4782cb*/
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
            <Row ref="glyphs">
                <div class="glyph-list" :style="{height: getHeight, flexDirection: getDirection}">
                    <div v-for="r in rectData">
                        <glyph-block :imgData="getImageData(r)" :rectData="r" :active=false @highlight="onHighlight"></glyph-block>
                    </div>
                </div>
            </Row>
            <Row type="flex" align="bottom" justify="center">
                <!-- <Button type="warning" size="large" shape="circle" class="button-abandon">放弃</Button> -->
                <Button type="success" size="large" shape="circle" class="button-submit" @click="submit" :loading="isBtnLoading" icon="checkmark-round">
                    <span v-if="!isBtnLoading">提交</span>
                    <span v-else>进行中</span>
                </Button>
            </Row>
        </Col>
        <Col span="7" :xs="14" :sm="11" :md="9" :lg="6">
            <Row>
                <div ref="wrapper" class="canvas-layout" :style="{height: getHeightCanvas}">
                    <div><canvas-op :redraw="updateCanvas" @scrollToRect="scrollToRect"></canvas-op></div>
                </div>
            </Row>
        </Col>
    </Row>
    <help></help>
</div>
</template>

<script>
import canvasOp from './canvas_op_disable_draw.vue';
import glyphBlock from './glyph_block.vue';
import util from '@/libs/util';
import _ from 'lodash';
import help from './help.vue';
import bus from '@/bus';

export default {
    name: 'confidence',
    props: ['rectData'],

    components: {
        canvasOp,
        glyphBlock,
        help
    },
    computed: {
        // Make sure canvas is properly displayed within the window height.
        getHeightCanvas: function () {
            return (window.innerHeight - 130) + 'px';
        },

        getHeight: function() {
            return (window.innerHeight - 145) + 'px';
        },

        getDirection: function() {
            return this.rectData.length > 20? 'column' : 'row';
            // return 'column';
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
    watch: {
        rectData() {
            this.init();
        }
    },

    mounted() {
        this.init();
        bus.$on('keyEvent', function(event) {
            if (event.type == 'keydown')
                this.handleKeyEvent(event);
        }.bind(this));
    },

    beforeDestroy() {
        this.$store.commit('resetAll')
    },

    methods: {
        init() {
            this.$store.commit('resetAll');
            this.$store.commit('setScale', {scale: 6});
        },

        onHighlight(item) {
            this.updateCanvas +=1;

            // Make sure show the exact part of canvas
            this.scrollToRect(item.rect);
        },

        scrollToRect() {
            let scale = this.$store.getters.scale;
            let rect = this.$store.getters.curRect;
            this.$nextTick(function() {
                this.$refs.wrapper.scrollTo(rect.x * scale, Math.max(rect.y * scale - (window.innerHeight/3), rect.y));
            });
            window.wrapper = this.$refs.wrapper;
        },

        getImageData(rect) {
            let column = rect.column_set;

            column.url = util.getColumnImageUrlFromCode(column.col_id);
            return column;
        },

        submit() {
            let final = []
            let list = this.$refs.glyphs.$children;
            _(list).forEach(function(glyph) {
                final.push(glyph.getRectData())
            });
            this.$emit('submit', {rects: final, _this: this});
        },

        handleKeyEvent(event) {
            let act = event.action;
            let step = (event.modify.enlarge || event.modify.step)? 5 : 1;
            let next = 1;
            if (act == 'mov-up-w' || act == 'mov-left-a') {
                next = -1;
            } else if (act == 'mov-down-s' || act == 'mov-right-d') {
                next = 1;
            } else {
                return
            }

            let curGlyph = this.$store.getters.curGlyph;
            let list = this.$refs.glyphs.$children;
            let index = _(list).indexOf(curGlyph) + next * step;
            let len = list.length;

            index = index < 0 ? len + index : (index >= len ? index - len : index);
            list[index].onClick();

            // if (len <= 20) return;

            this.$nextTick(function(){
                let gwidth = 140; // 140 for width of glyph-block
                let gheight = 302; // 187 for height of glyph-block, 302 for height including char block
                let container = document.getElementsByClassName('glyph-list')[0];
                let cheight = container.clientHeight;
                let cwidth = container.clientWidth;
                let verticalNum = ~~(cheight/gheight); // ~~ get floor of a float number
                let horiNum = ~~(index/verticalNum); // Now we have the location of a glyph-block
                let x = horiNum * gwidth - cwidth/3;
                let y = (~~((index/verticalNum - ~~(index/verticalNum)) * verticalNum) - 1) * gheight - cheight/3;
                container.scrollTo(x, y);
            });
        }
    }
}
</script>
