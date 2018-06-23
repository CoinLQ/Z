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
            pathname: 'judgefeedback',
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
                    title: '原始文本',
                    key: 'original_text'
                },
                {
                    title: '反馈文本',
                    key: 'fb_text'
                },
                {
                    title: '反馈说明',
                    key: 'fb_comment'
                },
                {
                    title: '反馈用户',
                    key: 'fb_user_display'
                },
                {
                    title: '反馈时间',
                    key: 'created_at'
                },
                {
                    title: '审查时间',
                    key: 'processed_at'
                },
                {
                    title: '审查意见',
                    key: 'response'
                },
            ],
        }
    }

}
</script>
