<template>
<MyFeedbackList :viewRouteName="pathname" :columns="columns"></MyFeedbackList>
</template>

<script>
import MyFeedbackList from './my_feedback_list';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    components: {MyFeedbackList: MyFeedbackList},
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
            ],
        }
    }

}
</script>
