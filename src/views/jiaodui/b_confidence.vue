<style></style>

<template>
<confidence :rectData="rects" @submit="onSubmit"></confidence>
</template>

<script>
import util from '@/libs/util';
import confidence from './components/confidence';

export default {
    name: 'bConfidence',
    components: {
        confidence,
    },
    data () {
        return {
            rects: [],
            task_id: '',
        }
    },

    mounted() {
        this.getWorkingData();
        this.$Notice.config({top: 50, duration: 3});
    },

    methods: {
        getWorkingData() {
            let that = this;
            let url = '/api/cctask/obtain/';

            if (this.$route.params.tid) {
                url = '/api/cctask/' + this.$route.params.tid + '/';
            }
            that.$Loading.start();
            // Fetch glyphs data
            util.ajax.get(url).then(function(response){
                let suc = response.data.status == 0;
                that.$Loading.finish();
                if (!suc) {
                    throw {message: response.data.msg}
                }
                that.rects = response.data.rects;
                that.task_id = response.data.task_id;
            }).catch(function(error){
                that.$Loading.error();
                that.$Notice.error({
                    title: that.$t('Failed'),
                    desc: that.$t(error.message)
                });
            });
        },

        onSubmit(sender) {
            let that = this;
            let url = '/api/cctask/' + this.task_id + '/done/';
            let sender_this = sender._this;
            sender_this.$data.isBtnLoading = true;

            util.ajax.post(url, {rects: sender.rects})
            .then(function(response){
                let suc = response.data.status == 0;
                if (!suc) {
                    throw {message: response.data.msg}
                }
                sender_this.$data.isBtnLoading = false;
                that.$Notice.success({title: '随喜', desc: ''});
                if (that.$route.params.tid) {
                    that.$router.push({ path: '/mytask/confidence'});
                } else {
                    that.getWorkingData();
                }
            })
            .catch(function (error) {
                sender_this.$data.isBtnLoading = false;
                that.$Notice.error({
                    title: that.$t('Failed'),
                    desc: that.$t(error.message)
                });
            })
        },

    }
}
</script>
