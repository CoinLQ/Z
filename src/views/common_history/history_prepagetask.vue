<template>
<HistoryApiList :appName="appname" :viewRouteName="pathname" :columns="columns" :dataUri="apiUrl"></HistoryApiList>
</template>

<script>
import HistoryApiList from './history_api_list';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    components: {HistoryApiList: HistoryApiList},
    data() {
        return {
            appname: 'pretask',
            pathname: 'prepagecoltask',
            apiUrl: '/api/prepagecoltask/history/',
            columns: [
                {
                    title: '批次号',
                    key: 'schedule_no',
                },
                {
                    title: '任务号',
                    key: 'tid'
                },
                {
                    title: '页信息',
                    key: 'page_info'
                },
                {
                    title: '优先级',
                    key: 'priority'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                  title: '领取时间',
                  key: 'obtain_date'
                },
                {
                    title: '最后处理时间',
                    key: 'update_date'
                },
            ],
        }
    }

}
</script>
