// 经文显示单元
<style></style>
<template>
    <span>
        <span v-if="data.type == 0">{{ data.text }}</span>
        <span v-else-if="data.type == 1" tag="br"><br /></span>
        <span v-else-if="data.type == 2"><a href="#" :diffsegno="data.diffseg_no" :class="className"><span class="diffseg-tag-white"></span></a></span>
        <span v-else-if="data.type == 3"><a href="#" :diffsegno="data.diffseg_no" :class="className">{{ data.text }}</a></span>
        <span v-else>
            <a href="#" :diffsegno="data.diffseg_no" :class="className">
                <span v-for="(line, index) in data.lines" tag="seg">{{ line }}<br v-if="index < data.lines.length-1" /></span>
            </a>
        </span>
    </span>
</template>
<script>
export default {
    name: 'sutraUnit',
    props: ['data', 'sharedata'],
    computed: {
        className: function() {
            if (this.data.type == 2) {
                if (this.sharedata.diffseg_no == this.data.diffseg_no) {
                    return 'diffseg-tag-notext-selected';
                } else {
                    return 'diffseg-tag-notext';
                }
            } else if (this.data.type == 3) {
                if (this.sharedata.diffseg_no == this.data.diffseg_no) {
                    return 'diffseg-tag-selected';
                }
            }
            return '';
        }
    }
}
</script>
