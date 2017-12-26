<style scoped>
    .layout-content-main{
        padding: 10px;
        border: 1px;
        text-align: center;
        color: #9ea7b4;
    }
</style>
<template>
            <Row ref="mainrow">
                <Col span="17">
                    <div class="layout-content-main"><h1>聚类校对</h1></div>
                </Col>
                <Col span="7">
                    <div class="canvas-layout">
                        <canvas-op :rects="rects" :imageUrl="image_url"></canvas-op>
                    </div>
                </Col>
            </Row>

</template>
<script>
import canvasOp from './components/canvas_op.vue';
export default {
    name: 'bClassify',
    components: {
        canvasOp,
    },
    data () {
        return {
            rects: [],
            // rects: [{"id":"5e2841f9-e5c0-418c-973e-0e6adea7ee58","line_no":5,"col_no":7,"x":60,"y":155,"width":43,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false},
            //         {"id":"5e2841f9-e5c0-418c-973e-0e6adea2ee58","line_no":5,"col_no":7,"x":60,"y":198,"width":38,"height":34,"confidence":0.711728,"op":0,"hans":"\u554f","page_id":"29737aa7-3b1f-452c-9b48-390f8e83ddab", "valid": false}],
            image_url: "http://oidgqmecg.bkt.clouddn.com/jiaodui/hint_image.png",
        }
    },
}
</script>
