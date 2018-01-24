<style scoped>
    .ivu-table .demo-table-info-cell-address {
        background-color: #187;
        color: #fff;
    }
</style>>

<template>
<div>
    <Table ref="selection" :loading="loading" border size="large" height="getHeight" :columns="columns" :data="rows" ></Table>
    <Button @click="handleSelectAll(true)">Set all selected</Button>
    <Button @click="handleSelectAll(false)">Cancel all selected</Button>
</div>
</template>

<script>
import util from '@/libs/util';

export default {
    data () {
        return {
        	loading: false,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '批次号',
                    key: 'bid',
                },
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
                	key: 'assign_dt'
                },
                {
                    title: '完成时间',
                    key: 'complete_dt'
                },
                {
                	title: '操作',
                	key: 'op',
                	fixed: 'right',
                	align: 'center',
        	      	render: (h, params) => {
        	      		// 参考https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5-data-%E5%AF%B9%E8%B1%A1
        	      		// 数据要加上radioValue
                        return h('RadioGroup', {
                        	props: {
                        		type: 'button',
                        		value: params.row.radioValue
                        	},
                        	on: {
                    			input: (value) => {
                    				// console.dir(this)
                    				// console.dir(params)
                    				params.row.radioValue = value;
                    				// util.ajax()
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
                                    label: 2
                                },
                            }, '不同意')
                    	]);
                    }
                }
            ],
            rows: [
                {
                    bid: '00001000100110101',
                    tid: '贤二',
                    status: 'completed',
                    assign_dt: '20171231 06:48',
                    complete_dt: '20171231 06:48'
                },

            ],
            task_id: ''
        }
    },
    computed: {
    	getHeight() {
    		return window.innerHeight
    	}
    },
    methods: {

    },
    mounted() {
        let that = this;
        util.ajax('/api/cctask/obtain').then(function (response) {
            if (response.data.status) {
                    throw {message: response.data.msg}
                }
            that.rows = response.data.rects;
            that.task_id = response.data.task_id;
        })
    }
}
</script>
