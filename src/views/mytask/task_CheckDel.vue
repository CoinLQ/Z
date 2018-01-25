<style scoped>
.button {
    margin-top: 15px;
    background-color: #cccccc29;
    border-color: #cccccc;
}

.button:hover {
    color: #fff;
    background-color: #2db7f5; /*#19be6b; /*#28a9e4*/
    border-color: #2db7f5; /*#47cb89; /*#4782cb*/
}

.table {
    box-shadow: 0px 0px 3px 3px #363E4E;
    border-radius: 2px;
}

.wrapper {
    margin: 10px;
}
</style>>

<template>
    <div class="wrapper">
        <Table stripe border class="table" size="large" :height="getHeight" :loading="loading" :columns="columns" :data="rows"></Table>
    </div>
</template>

<script>
import util from '@/libs/util';
import _ from 'lodash';
import RectBlock from '@/views/jiaodui/components/rect_block';
import Vue from 'vue';

export default {
    name: 'CheckDeletedRect',
    components: { 'RectBlock': RectBlock },
    data () {
        return {
            isBtnLoading: false,
          loading: false,
            columns: [
                {
                    title: '经字号',
                    key: 'cid',
                    fixed: 'left'
                },
                {
                    title: '提交人',
                    key: 'modifier'
                },
                {
                    title: '提交时间',
                    key: 'created_at'
                },
                {
                    title: '提交删框',
                    key: 'rect',
                    width: 160,
                    render: (h, params) => {
                        return h(RectBlock, {
                            props: {
                                rectData: params.row,
                            }
                        });
                    }
                },
                {
                    title: '审定结果',
                    key: 'result'
                },
                {
                  title: '操作',
                  key: 'op',
                  fixed: 'right',
                  align: 'center',
                    width: 180,
                  render: (h, params) => {
                        return h('RadioGroup', {
                          props: {
                            type: 'button',
                            value: params.row.result
                          },
                          on: {
                          input: (value) => {
                            params.row.result = value;
                                    this.rows[params.index].result = value;
                          }
                          }
                      }, [
                            h('Radio', {
                                attrs: {
                                    name: 'bg' + params.index,
                                    label: 1
                                },
                            }, '同意'),
                            h('Radio', {
                                attrs: {
                                    name: 'bg' + params.index,
                                    label: 0
                                },
                            }, '不同意')
                      ]);
                    }
                }
            ],
            rows: [],
        }
    },
    computed: {
      getHeight() {
        return window.innerHeight
      }
    },
    methods: {
        getWorkingData() {
            let that = this;
            that.loading = true;
            util.ajax.get('/api/deltask/history').then(function (response) {
                that.rows = response.data.rects;
                that.loading = false;
            }).catch(function (error) {
                that.$Notice.error({
                    title: 'Failed',
                    desc: error.message
                });
                that.loading = false;
            })
        }
    },
    mounted() {
        this.getWorkingData();
    }
}
</script>
