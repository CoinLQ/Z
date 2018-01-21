<style></style>

<template>
<confidence :rectData="rects" @submit="onSubmit"></confidence>
</template>

<script>
import util from '@/libs/util';
import confidence from './components/confidence';

export default {
    name: 'bOneByOneCheck',
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
    },

    methods: {
        getWorkingData() {
            let that = this;
            // Fetch glyphs data
            util.ajax.get('/api/cctask/obtain/').then(function(response){
                if (response.data.status) {
                    throw 'status exception'
                }
                that.rects = response.data.rects;
                that.task_id = response.data.task_id;
            }).catch(function(error){
                console.log(error);
                that.$Notice.error({
                    title: 'Something went wrong.',
                    desc: error.message
                });
            });
        },

        onSubmit(rects) {
            let that = this;
            this.isBtnLoading = true;

            util.ajax.post('/api/cctask/done', {rects: rects})
            .then(function(response){
                let suc = response.data.status == 0;
                let alert = suc? that.$Notice.success : that.$Notice.error;
                alert({
                    title: suc? 'success': 'Failed',
                    desc: suc? '' : response.data.msg
                });
                that.isBtnLoading = false;
            })
            .catch(function (error) {
                that.isBtnLoading = false;
                that.$Notice.error({
                    title: 'Something went wrong.',
                    desc: error.message
                });
            })
        },

    }
}
</script>
