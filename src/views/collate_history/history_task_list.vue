<style scoped>
.table {
    box-shadow: 0px 0px 1px 1px rgb(188, 191, 197);
    border-radius: 1px;
}
#search {
    padding: 0px 0px 10px 5px;
    position: relative;
    display: inline-block;
    width: 100%
}
.wrapper {
    margin: 10px;
}
#header {
    padding: 0px 0px 10px 5px;
    position: relative;
    width: 100%;
    height: 48px;
}
.l-actions {
    padding: 0px 0px 10px 5px;
    position: relative;
    width: 100%;
    height: 48px;
}

.l-actions > .ivu-btn {
    line-height: 2;
    color: white;
}
</style>

<template>
<div>
    <div class="wrapper">
         <Row>
            <Col span="6"><div class="l-actions"><Button type="info" @click="startTask">开始任务</Button></div></Col>
            <Col span="6" offset="12">
                <div id="search">
                    <Input type="text"
                        placeholder="关键字..."
                        size="default"
                        autocomplete="off"
                        v-model="keyword"
                        icon="close-circled"
                        @on-click="clear"
                        autofocus
                        @keyup.native.enter="search(keyword)"/>
                </div>
            </Col>
        </Row>
        <Table stripe border class="table" size="large" :height="inner_height" :loading="loading" :columns="total_column" :data="rows"></Table>
    </div>

    <Page :total="pagination.total_pages" :current="pagination.page" :pageSize="pagination.page_size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-elevator show-sizer></Page>
</div>
</template>
<script>
import util from '@/libs/util';
import ButtonWrapper from '../mytask/ButtonWrapper';
import { on, off } from 'iview/src/utils/dom';

export default {
    name: 'HistoryTaskList',
    componenets: [ButtonWrapper],
    props: ['columns', 'viewRouteName'],
    data () {
        return {
            loading: false,
            inner_height: 100,
            keyword: '',
            action: {
                  title: '操作',
                  key: 'op',
                  fixed: 'right',
                  align: 'center',
                  width: 100,
                  render: (h, params) => {
                        return h(ButtonWrapper, {
                            props: {
                                size: 'large',
                                text: '查看'
                            },
                            on: {
                                click: (e) => {
                                    this.obtain(params.index);
                                }
                            }
                        });
                    }
            },
            rows: [],
            pagination: {},
        }
    },
    computed: {
        dataUrl() {
            return "/api/v1/tasks/" + this.viewRouteName + "/history";
        },
        total_column() {
            return this.columns.concat(this.action)
        }
    },
    methods: {
        startTask() {
            let task = _.find(this.rows, function(v) { return v.status=="进行中" });
            if (!task) {
                this.gotoPickTask()
            } else {
               this.$router.push({name: this.viewRouteName, params: {id: task.id}}) 
            }
        },
        gotoPage(page, page_size) {
            this.loadData({ params: {page, page_size} })
        },
        changePage(page) {
            this.gotoPage(page, this.pagination.page_size);
        },
        changePageSize(size) {
            this.gotoPage(this.pagination.page, size);
        },
        clear() {
            this.keyword = '';
            this.search(event);
        },
        search(event) {
            this.loadData({'search': this.keyword});
        },
        loadData(data) {
            let that = this;
            let param = { params: data }
            that.loading = true;
            util.ajax.get(this.dataUrl, param).then(function (response) {
                that.rows = response.data.models;
                that.loading = false;
                that.pagination = response.data.pagination;
            }).catch(function (error) {
                that.$Notice.error({
                    title: that.$t('Failed'),
                    desc: error.message
                });
                that.loading = false;
            })
        },
        obtain(index){
            let id = this.rows[index].id
            this.$router.push({name: this.viewRouteName, params: {id: id}})
        },
        handleResize() {
            this.inner_height = window.innerHeight - 192
            return
        },
        gotoPickTask () {
            return this.$router.push({name: 'picktask_index', params: {task: this.viewRouteName}})
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
