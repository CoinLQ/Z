<style scoped>
.table {
    box-shadow: 0px 0px 3px 3px #dddee1;
    border-radius: 2px;
}

.wrapper {
    margin: 10px;
}
</style>

<template>
<div>
    <div class="wrapper">
        <Table stripe border class="table" size="large" :height="getHeight" :loading="loading" :columns="columns" :data="rows"></Table>
    </div>

    <Page :total="pagination.total_pages" :current="pagination.page" :pageSize="pagination.page_size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-elevator show-sizer></Page>
</div>
</template>

<script>

import util from '@/libs/util';
import ButtonWrapper from './ButtonWrapper';

export default {
    name: 'TaskList',
    componenets: [ButtonWrapper],
    data () {
        return {
            inner_height: 100,
            dataUrl: '/api/deltask/history/',
            viewRouteName : 'checkdel',
            loading: false,
            columns: [
                {
                    title: '任务号',
                    key: 'tid'
                },
                {
                    title: '任务状态',
                    key: 'status'
                },
                {
                  title: '领取时间',
                  key: 'assigned_date'
                },
                {
                    title: '最后处理时间',
                    key: 'update_date'
                },
            ],
            rows: [],
            pagination: {},
        }
    },
    computed: {
      getHeight() {
        return this.inner_height
      }
    },
    methods: {
        gotoPage(page, page_size) {
            let that = this;
            let offset = '?page='+page+'&page_size='+page_size;
            that.loading = true;

            util.ajax.get(this.dataUrl + offset).then(function (response) {
                that.rows = response.data.models;
                that.loading = false;
                that.pagination = response.data.pagination;
            }).catch(function (error) {
                that.$Notice.error({
                    title: this.$t('Failed'),
                    desc: error.message
                });
                that.loading = false;
            })
        },
        changePage(page) {
            this.gotoPage(page, this.pagination.page_size);
        },
        changePageSize(size) {
            this.gotoPage(this.pagination.page, size);
        },
        handleResize() {
            this.inner_height = window.innerHeight - 150
        }
    },
    mounted() {
        this.gotoPage(1, 10)
        this.handleResize();
        on(window, 'resize', this.handleResize);
    },
    beforeDestroy () {
        off(window, 'resize', this.handleResize);
    }
}
</script>
