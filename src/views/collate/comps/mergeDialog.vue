<style></style>
<template>
    <el-dialog title="合并" :visible.sync="sharedata.mergeDialogVisible" width="30%" @open="handleOpen" :before-close="handleCancel">
        <p>选择待合并的校勘记</p>
        <ul>
            <li v-for="diffsegresult in diffsegresults">
            <input type="checkbox" :id="diffsegresult.id" :value="diffsegresult.id" v-model="diffsegresult_ids" />
            <label :for="diffsegresult.id">{{ getBaseText(diffsegresult) }}</label>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <span class="alert alert-danger" v-if="error">{{ error }}</span>
            <el-button type="primary" @click="handleOK">合并</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import {Button, Dialog} from 'element-ui';

export default {
    name: 'mergeDialog',
    props: ['sharedata'],
    components: {
        'el-button': Button,
        'el-dialog': Dialog
    },
    data: function() {
        return {
            diffsegresult_id: '',
            base_pos: 0,
            diffsegresults: [],
            diffsegresult_ids: [],
            error: null
        }
    },
    methods: {
        getBaseText: function(diffsegresult) {
            var diffsegtexts = diffsegresult.diffseg.diffsegtexts;
            var length = diffsegtexts.length;
            var text = '';
            for (var i = 0; i < length; ++i) {
                if (diffsegtexts[i].tripitaka.id == this.sharedata.base_tripitaka_id) {
                    text = diffsegtexts[i].text;
                    break;
                }
            }
            if (text == '') {
                text = '底本为空';
            }
            return text;
        },
        handleOpen: function() {
            var diffsegresult = this.sharedata.diffsegresults[this.sharedata.segindex];
            this.diffsegresult_id = diffsegresult.id;
            this.diffsegresult_ids = [this.diffsegresult_id];
            for (var i = 0; i < diffsegresult.merged_diffsegresults.length; ++i) {
                this.diffsegresult_ids.push(diffsegresult.merged_diffsegresults[i]);
            }
            var vm = this;
            axios.get('/api/judge/' + this.sharedata.task_id +
            '/diffsegresults/' + this.diffsegresult_id + '/mergelist/')
            .then(function(response) {
                console.log(response.data)
                vm.diffsegresults = response.data;
            })
        },
        handleOK: function() {
            var vm = this;
            var merged_diffsegresults = [];
            for (var i = 0; i < this.diffsegresult_ids.length; ++i) {
                var id = this.diffsegresult_ids[i];
                if (id != this.diffsegresult_id) {
                    merged_diffsegresults.push(id);
                }
            }
            var url = '/api/judge/' + this.sharedata.task_id +
            '/diffsegresults/' + this.diffsegresult_id + '/';
            axios.put(url, {
                typ: 1,
                merged_diffsegresults: merged_diffsegresults,
                split_info: '{}'
            })
            .then(function(response) {
                vm.$emit('reload');
                vm.sharedata.mergeDialogVisible = false;
            })
            .catch(function(error) {
                vm.error = '提交出错！';
            });
        },
        handleCancel: function() {
            this.sharedata.mergeDialogVisible = false;
            this.error = null;
        }
    }
}
</script>
