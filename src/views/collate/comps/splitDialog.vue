<style scoped>

</style>
<template>
    <el-dialog title="拆分" :visible.sync="sharedata.splitDialogVisible" width="50%" @open="handleOpen" :before-close="handleCancel">
        <button class="btn" @click="incrementSplitCount">新增</button>
        <button class="btn" @click="decrementSplitCount">减少</button><span>减少到1将取消原先的拆分。</span>
        <table class="table table-bordered table-condensed">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="tname in tname_lst">{{ tname }}</th>
                    <th>我的选择</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="(title, index) in title_lst">
                <td>{{ title }}</td>
                <td v-for="(tripitaka_id, tripitaka_index) in tripitaka_ids">
                    <textarea cols="5" v-model="tripitaka_id_to_texts[tripitaka_id][index]" @input="verifyData"></textarea>
                </td>
                <td>
                    <textarea cols="5" v-model="selected_lst[index]" @input="verifyData"></textarea>
                </td>
            </tr>
            </tbody>
        </table>
        <span slot="footer" class="dialog-footer">
            <span class="alert alert-danger" v-if="error">{{ error }}</span>
            <el-button type="primary" @click="handleOK" :disabled="okDisabled">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {Button, Dialog} from 'element-ui';

export default {
    name: 'splitDialog',
    props: ['sharedata'],
    components: {
        'el-button': Button,
        'el-dialog': Dialog
    },
    data: function () {
        return {
            diffsegresult_id: '',
            split_count: 2,
            title_lst: [],
            tripitaka_ids: [],
            tname_lst: [],
            tripitaka_id_to_oldtext: {},
            tripitaka_id_to_texts: {},
            selected_lst: [],
            okDisabled: true,
            error: null
        }
    },
    methods: {
        splitText: function(text, count) {
            var textseg_lst = [];
            var seg_length = Math.ceil(text.length / count);
            for (var i = 0; i < text.length;) {
                textseg_lst.push(text.substr(i, seg_length));
                i += seg_length;
            }
            var remained = count - textseg_lst.length;
            for (var i = 0; i < remained; ++i) {
                textseg_lst.push('');
            }
            return textseg_lst;
        },
        generateSplitItems: function() {
            var diffsegresult = this.sharedata.diffsegresults[this.sharedata.segindex];
            if (diffsegresult.typ == 2) {
                var split_info = JSON.parse(diffsegresult.split_info);
                this.split_count = split_info.split_count;
                this.tripitaka_id_to_texts = split_info.tripitaka_id_to_texts;
                this.selected_lst = split_info.selected_lst;
                this.title_lst = [];
                this.tripitaka_ids = [];
                this.tname_lst = [];
                this.tripitaka_id_to_oldtext = {};
                for (var i = 1; i <= this.split_count; ++i) {
                    this.title_lst.push(i.toString());
                }
                var diffsegtexts = this.sharedata.diffsegresults[this.sharedata.segindex].diffseg.diffsegtexts;
                var length = diffsegtexts.length;
                for (var i = 0; i < length; ++i) {
                    var text_lst = this.splitText(diffsegtexts[i].text, this.split_count);
                    var tripitaka_id = diffsegtexts[i].tripitaka.id;
                    var tname = diffsegtexts[i].tripitaka.shortname;
                    this.tripitaka_ids.push(tripitaka_id);
                    this.tname_lst.push(tname);
                    this.tripitaka_id_to_oldtext[tripitaka_id] = diffsegtexts[i].text;
                }
            } else {
                this.split_count = 2;
                this.title_lst = [];
                this.tripitaka_ids = [];
                this.tname_lst = [];
                this.tripitaka_id_to_oldtext = {};
                this.tripitaka_id_to_texts = {};
                this.selected_lst = [];
                for (var i = 1; i <= this.split_count; ++i) {
                    this.title_lst.push(i.toString());
                    this.selected_lst.push('');
                }
                var diffsegtexts = this.sharedata.diffsegresults[this.sharedata.segindex].diffseg.diffsegtexts;
                var length = diffsegtexts.length;
                for (var i = 0; i < length; ++i) {
                    var text_lst = this.splitText(diffsegtexts[i].text, this.split_count);
                    var tripitaka_id = diffsegtexts[i].tripitaka.id;
                    var tname = diffsegtexts[i].tripitaka.shortname;
                    this.tripitaka_ids.push(tripitaka_id);
                    this.tname_lst.push(tname);
                    this.tripitaka_id_to_oldtext[tripitaka_id] = diffsegtexts[i].text;
                    this.tripitaka_id_to_texts[tripitaka_id] = text_lst;
                }
            }
        },
        verifyData: function() {
            var i = 0;
            var j = 0;
            for (var i = 0; i < this.tripitaka_ids.length; ++i) {
                var tripitaka_id = this.tripitaka_ids[i];
                var mergetext = this.tripitaka_id_to_texts[tripitaka_id].join('');
                if (mergetext != this.tripitaka_id_to_oldtext[tripitaka_id]) {
                    this.okDisabled = true;
                    return true;
                }
            }
            for (var i = 0; i < this.split_count; ++i) {
                if (this.selected_lst[i] == undefined) {
                    this.selected_lst[i] = '';
                }
                var match = false;
                for (var j = 0; j < this.tripitaka_ids.length; ++j) {
                    var tripitaka_id = this.tripitaka_ids[j];
                    if (this.tripitaka_id_to_texts[tripitaka_id][i] == this.selected_lst[i]) {
                        match = true;
                    }
                }
                if (!match) {
                    this.okDisabled = true;
                    return true;
                }
            }

            this.okDisabled = false;
            return false;
        },
        incrementSplitCount: function () {
            if (this.split_count < 20) {
                this.split_count++;
                this.generateSplitItems();
            }
        },
        decrementSplitCount: function () {
            if (this.split_count > 1) {
                this.split_count--;
                this.generateSplitItems();
            }
        },
        handleOpen: function () {
            this.diffsegresult_id = this.sharedata.diffsegresults[this.sharedata.segindex].id;
            this.generateSplitItems();
        },
        handleOK: function () {
            var vm = this;
            var url = '/api/judge/' + this.sharedata.task_id + '/diffsegresults/' + this.diffsegresult_id + '/';
            var data = '';
            if (this.split_count == 1) {
                data = {
                    typ: 1,
                    split_info: '{}',
                    merged_diffsegresults: []
                }
            } else {
                var split_info = JSON.stringify({
                    split_count: this.split_count,
                    tripitaka_id_to_texts: this.tripitaka_id_to_texts,
                    selected_lst: this.selected_lst
                });
                data = {
                    typ: 2,
                    split_info: split_info,
                    selected: 1,
                    selected_text: this.selected_lst.join(''),
                    merged_diffsegresults: []
                }
            }

            axios.put(url, data)
            .then(function(response) {
                vm.$emit('reload');
                vm.sharedata.splitDialogVisible = false;
            })
            .catch(function (error) {
                vm.error = '提交出错！';
            });
        },
        handleCancel: function() {
            this.sharedata.splitDialogVisible = false;
            this.error = null;
        }
    }
}
</script>


