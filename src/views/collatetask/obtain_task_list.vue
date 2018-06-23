<style scoped>
.table {
    box-shadow: 0px 0px 1px 1px rgb(188, 191, 197);
    border-radius: 1px;
}
#search {
    padding: 0px 0px 10px 5px;
    position: relative;
    left: 70%;
    width: 30%;
}
.wrapper {
    margin: 10px;
}
</style>

<template>
<div>
    <div class="wrapper">
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
        <Table stripe border class="table" size="large" :height="inner_height" :loading="loading" :columns="total_column" :data="rows"></Table>
    </div>

    <Page :total="pagination.total_entries" :current="pagination.page" :pageSize="pagination.page_size" @on-change="changePage" @on-page-size-change="changePageSize" size="small" show-elevator placement="top" show-sizer></Page>
</div>
</template>
<script>
import util from '@/libs/util';
import { on, off } from 'iview/src/utils/dom';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    name: 'ObtianTaskList',
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
                                text: '领取'
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
            return "/api/v1/tasks/" + this.viewRouteName;
        },
        total_column() {
            return this.columns.concat(this.action)
        }
    },
    methods: {
        gotoPage(page, page_size) {
            this.loadData({page, page_size})
        },
        changePage(page) {
            this.gotoPage(page, this.pagination.page_size);
        },
        changePageSize(size) {
            this.pagination.page_size = size;
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
            if (!data.search && !!this.keyword) {
                data.search = this.keyword
            }
            if (!!this.pagination.page_size) {
                data.page_size = this.pagination.page_size;
            }
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
            let that = this;
            let id = this.rows[index].id
            let url = this.dataUrl +"/" +id + "/obtain"
            that.loading = true;
            util.ajax.put(url).then(function (response) {
                that.loading = false;
                if (response.data.status == 0) {
                    return that.$router.push({name: that.viewRouteName, params: {id: id}})
                }
                else {
                    that.$Notice.error({
                        title: that.$t('Failed'),
                        desc: response.data.msg
                    });
                }
            }).catch(function (error) {
                that.$Notice.error({
                    title: that.$t('Failed'),
                    desc: error.message
                });
                that.loading = false;
            })
        },
        handleResize() {
            this.inner_height = window.innerHeight - 206
        }
    },
    mounted() {
        this.gotoPage(1, 10)
        this.handleResize();
        on(window, 'resize', this.handleResize);
        let pathArr = util.setCurrentPath(this, this.$route.name);
        this.$store.commit('updateMenulist');
        if (pathArr.length >= 2) {
            this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
    },
    beforeDestroy () {
        off(window, 'resize', this.handleResize);
    }
}
</script>
