<template>
<ObtianTaskList :viewRouteName="pathname" :columns="columns"></ObtianTaskList>
</template>

<script>
import ObtianTaskList from './obtain_task_list';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    components: {ObtianTaskList: ObtianTaskList},
    data() {
        return {
            pathname: 'verify_correct',
            columns: [
                {
                    title: '批次号',
                    key: 'batch_task',
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

            ],
        }
    }

}
</script>
