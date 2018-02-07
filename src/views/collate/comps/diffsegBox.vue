<style></style>
<template>
    <div class="diffseg-box" @click.stop.prevent="click">
        <div><span>{{ base_text }}</span>
        </div>
        <span v-for="(diffsegtexts, text, index) in diffsegresult.text_to_diffsegtexts">
            <span v-html="diffsegtextsJoin(diffsegtexts)"></span>
            <span v-if="text">：{{ text }}</span>
            <span v-else>为空</span>
            <span v-if="index < (diffsegresult.text_count - 1)">；</span>
            <span v-else>。</span>
        </span>
        <div>
            <a href="#" class="diffseg-btn" @click.stop.prevent="doJudge(segindex)" :disabled="diffsegresult.typ == 2">判取</a>
            <a href="#" class="diffseg-btn" @click.stop.prevent="doJudge(segindex)" :disabled="diffsegresult.typ == 2">存疑</a>
            <a href="#" class="diffseg-btn" @click.stop.prevent="doMerge(segindex)">合并</a>
            <a href="#" class="diffseg-btn" v-if="diffsegresult.merged_diffsegresults.length == 0" @click.stop.prevent="doSplit(segindex)">拆分</a>
        </div>
        <div>处理结果：{{ getResult(diffsegresult) }}
        </div>
    </div>
</template>
<script>

export default {
    name: 'diffsegBox',
    props: ['diffsegresult', 'segindex', 'sharedata'],

    computed: {
        base_text: function() {
            var base_tripitaka_id = this.sharedata.base_tripitaka_id;
            var length = this.diffsegresult.diffseg.diffsegtexts.length;
            var text = '';
            for (var i = 0; i < length; ++i) {
                var diffsegtext = this.diffsegresult.diffseg.diffsegtexts[i];
                if (diffsegtext.tripitaka.id == base_tripitaka_id) {
                    text = diffsegtext.text;
                    break;
                }
            }
            if (text == '') {
                text = '底本为空';
            }
            return text;
        }
    },
    methods: {
        click: function() {
            this.sharedata.diffseg_no = this.diffsegresult.diffseg.diffseg_no;
            this.$emit('segfocus');
            console.log('emit segfocus')
        },
        doJudge: function(segindex) {
            if (this.diffsegresult.typ == 2) {
                return ;
            }
            this.sharedata.segindex = segindex;
            this.sharedata.judgeDialogVisible = true;
        },
        doMerge: function(segindex) {
            this.sharedata.segindex = segindex;
            this.sharedata.mergeDialogVisible = true;
        },
        doSplit: function(segindex) {
            this.sharedata.segindex = segindex;
            this.sharedata.splitDialogVisible = true;
        },
        diffsegtextsJoin: function(diffsegtexts) {
            var i = 0;
            var lst = [];
            while (i < diffsegtexts.length) {
                var s = '';
                var start_char_pos = diffsegtexts[i].start_char_pos;
                if (start_char_pos != null && start_char_pos != '') {
                    var page_id = start_char_pos.substr(0, 13);
                    s = '<a href="/sutra_pages/' + page_id + '/view?char_pos='
                    + start_char_pos + '" target="_blank">'
                    + diffsegtexts[i].tripitaka.shortname + '</a>';
                } else {
                    s = diffsegtexts[i].tripitaka.shortname;
                }
                lst.push(s);
                ++i;
            }
            return lst.join('/');
        },
        getResult: function(diffsegresult) {
            var s = '';
            var merged_length = diffsegresult.merged_diffsegresults.length;
            if (diffsegresult.typ == 1) {
                var little_count = 0;
                var great_count = 0;
                for (var i = 0; i < merged_length; ++i) {
                    var id = diffsegresult.merged_diffsegresults[i];
                    if (id < diffsegresult.id) {
                        little_count++;
                    } else if (id > diffsegresult.id) {
                        great_count++;
                    }
                }
                if (little_count != 0 || great_count != 0) {
                    var texts = [];
                    if (little_count != 0) {
                        texts.push('前' + little_count + '条');
                    }
                    if (great_count != 0) {
                        texts.push('后' + great_count + '条');
                    }
                    s = '已与' + texts.join('、') + '合并；';
                }
            } else if (diffsegresult.typ == 2) {
                s = '已作拆分；'
            }
            if (diffsegresult.selected == 0) {
                s += '未判取';
            } else if (diffsegresult.doubt == 0) {
                s += '判取文本：' + diffsegresult.selected_text;
            } else if (diffsegresult.doubt == 1) {
                s += '判取文本：' + diffsegresult.selected_text + '。存疑，' + diffsegresult.doubt_comment + '。';
            }
            return s;
        }
    }
}
</script>
