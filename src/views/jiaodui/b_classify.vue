<style></style>

<template>
<confidence :rectData="rects" @submit="onSubmit"></confidence>
</template>

<script>
import util from '@/libs/util';
import confidence from './components/confidence';

export default {
    name: 'bClassify',
    components: {
        confidence,
    },
    data () {
        return {
            rects: [],
            task_id: '',
            char_set: [],
        }
    },

    mounted() {
        this.getWorkingData();
    },

    methods: {
        getWorkingData() {
            let that = this;
            let url = '/api/classifytask/obtain/';

            if (this.$route.params.tid) {
                url = '/api/classifytask/' + this.$route.params.tid + '/';
            }
            console.log(url);
            // Fetch glyphs data
            util.ajax.get(url).then(function(response){
                if (response.data.status) {
                    throw {message: response.data.msg}
                }
                that.rects = response.data.rects;
                that.task_id = response.data.task_id;
                that.char_set = response.data.char_set;
            }).catch(function(error){
                console.log(error);
                that.$Notice.error({
                    title: 'Failed',
                    desc: error.message
                });
            });
        },

        onSubmit(sender) {
            let that = this;
            let url = '/api/classifytask/'+ this.task_id +'/done/';
            let sender_this = sender._this;
            sender_this.$data.isBtnLoading = true;

            util.ajax.post(url, {rects: sender.rects})
            .then(function(response){
                let suc = response.data.status == 0;
                if (!suc) {
                    throw {message: response.data.msg}
                }
                sender_this.$data.isBtnLoading = false;
                that.$Notice.success({title: 'success', desc: ''});
                that.getWorkingData();
            })
            .catch(function (error) {
                sender_this.$data.isBtnLoading = false;
                that.$Notice.error({
                    title: 'Failed',
                    desc: error.message
                });
            })
        },

    }
}
</script>
