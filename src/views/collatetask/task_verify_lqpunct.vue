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
            pathname: 'verify_lqpunct',
            columns: [
                {
                    title: '批次号',
                    key: 'batchtask',
                },
                {
                    title: '龙泉经名',
                    key: 'lqsutra_name'
                },
                {
                    title: '第几卷',
                    key: 'lqreel_no'
                },
                {
                    title: '阶段',
                    key: 'task_no'
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
