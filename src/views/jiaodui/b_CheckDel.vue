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
        <Button type="success" size="large" class="button-submit button" @click="submit" :loading="isBtnLoading" icon="checkmark-round" long>
            <span v-if="!isBtnLoading">提交</span>
            <span v-else>进行中</span>
        </Button>
    </div>
</template>

<script>
import util from '@/libs/util';
import _ from 'lodash';
import RectBlock from './components/rect_block';
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
            task_id: ''
        }
    },
    computed: {
    	getHeight() {
    		return window.innerHeight
    	}
    },
    methods: {
        submit() {
            let that = this;
            let url = '/api/deltask/' + this.task_id + '/done/';
            this.isBtnLoading = true;

            util.ajax.post(url, {rects: this.rows})
            .then(function(response){
                let suc = response.data.status == 0;
                if (!suc) {
                    throw {message: response.data.msg}
                }
                that.isBtnLoading = false;
                that.$Notice.success({title: '٩(˘◡˘ )', desc: ''});
                that.getWorkingData();
            })
            .catch(function (error) {
                that.isBtnLoading = false;
                that.$Notice.error({
                    title: '━Σ(ﾟДﾟ|||)━',
                    desc: error.message
                });
            })
        },

        getWorkingData() {
            let that = this;
            let url = '/api/deltask/obtain/';

            if (this.$route.params.tid) {
                url = '/api/deltask/' + this.$route.params.tid + '/';
            }
            that.loading = true;
            util.ajax.get(url).then(function (response) {
                let suc = response.data.status == 0;
                if (!suc) {
                    throw {message: response.data.msg}
                }
                that.rows = response.data.rects;
                that.task_id = response.data.task_id;
                that.loading = false;
            }).catch(function (error) {
                that.$Notice.error({
                    title: '━Σ(ﾟДﾟ|||)━',
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
