<style></style>
<template>
    <el-dialog title="判取" :visible.sync="sharedata.judgeDialogVisible" width="30%" @open="handleOpen" :before-close="handleCancel">
        <table class="table table-bordered">
            <thead>
            <tr><th>判取</th><th>版本</th><th>用字</th></tr>
            </thead>
            <tbody v-if="sharedata.segindex >= 0">
            <tr v-for="(diffsegtexts, text) in sharedata.diffsegresults[sharedata.segindex].text_to_diffsegtexts">
                <td>
                    <input type="radio" v-bind:value="text" v-model="selected_text" />
                </td>
                <td>{{ joinTnames(diffsegtexts) }}</td>
                <td>{{ text }}</td>
            </tr>
            </tbody>
        </table>
        <span>是否存疑：</span>
        <div class="radio"><label>
            <input type="radio" v-model="doubt" value="0" />否
        </label></div>
        <div class="radio"><label>
            <input type="radio" v-model="doubt" value="1" />是
        </label></div>
        <div>存疑说明：</div>
        <textarea class="form-control" rows="3" v-model="doubt_comment"></textarea>
        <span slot="footer" class="dialog-footer">
            <span class="alert alert-danger" v-if="error">{{ error }}</span>
            <el-button type="primary" @click="handleOK">确定</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {Button, Dialog} from 'element-ui';
import axios from 'axios'

// judge
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export default {
    name: 'judgeDialog',
    props: ['sharedata'],
    components: {
        'el-button': Button,
        'el-dialog': Dialog
    },
    data: function() {
        return {
            diffsegresult_id: '',
            selected_text: '',
            doubt: '',
            doubt_comment: '',
            error: null
        }
    },
    methods: {
        handleOpen: function() {
            this.diffsegresult_id = this.sharedata.diffsegresults[this.sharedata.segindex].id;
            this.selected_text = this.sharedata.diffsegresults[this.sharedata.segindex].selected_text;
            this.doubt = this.sharedata.diffsegresults[this.sharedata.segindex].doubt;
            this.doubt_comment = this.sharedata.diffsegresults[this.sharedata.segindex].doubt_comment;
        },
        handleOK: function() {
            var vm = this;
            var url = '/api/judge/' + this.sharedata.task_id + '/diffsegresults/' + this.diffsegresult_id + '/';
            axios.put(url, {
                typ: 1,
                selected_text: vm.selected_text,
                selected: 1,
                doubt: vm.doubt,
                doubt_comment: vm.doubt_comment,
                split_info: '{}'
            })
            .then(function(response) {
                vm.sharedata.diffsegresults[vm.sharedata.segindex].selected_text = vm.selected_text;
                vm.sharedata.diffsegresults[vm.sharedata.segindex].selected = vm.selected;
                vm.sharedata.diffsegresults[vm.sharedata.segindex].doubt = vm.doubt;
                vm.sharedata.diffsegresults[vm.sharedata.segindex].doubt_comment = vm.doubt_comment;
                vm.$emit('reload');
                vm.sharedata.judgeDialogVisible = false;
            })
            .catch(function(error) {
                vm.error = '提交出错！';
            });
        },
        handleCancel: function() {
            this.sharedata.judgeDialogVisible = false;
            this.error = null;
        },
        joinTnames: function(diffsegtexts) {
            var tnames = [];
            diffsegtexts.forEach(function(diffsegtext) {
                tnames.push(diffsegtext.tripitaka.shortname);
            });
            return tnames.join('/');
        }
    }
}

</script>
