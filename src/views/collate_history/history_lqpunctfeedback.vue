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
            pathname: 'lqpunctfeedback',
            columns: [
                {
                    title: '龙泉经名',
                    key: 'lqsutra_name'
                },
                {
                    title: '第几卷',
                    key: 'reel_no'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '反馈用户',
                    key: 'fb_user_display'
                },
                {
                    title: '反馈时间',
                    key: 'created_at'
                },
            ],
        }
    }

}
</script>
