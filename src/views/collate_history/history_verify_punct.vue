<template>
<HistoryTaskList :viewRouteName="pathname" :columns="columns"></HistoryTaskList>
</template>

<script>
import HistoryTaskList from './history_task_list';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    components: {HistoryTaskList: HistoryTaskList},
    data() {
        return {
            pathname: 'verify_punct',
            columns: [
                {
                    title: '批次号',
                    key: 'batchtask',
                },
                {
                    title: '藏',
                    key: 'tripitaka_name'
                },
                {
                  title: '经',
                  key: 'sutra'
                },
                {
                    title: '第几卷',
                    key: 'reel_no'
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
                    key: 'picked_at'
                },
                {
                    title: '完成时间',
                    key: 'finished_at'
                },
            ],
        }
    }

}
</script>
