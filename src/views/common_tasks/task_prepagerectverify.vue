<template>
<ObtianApiList :appName="appname" :viewRouteName="pathname" :columns="columns"></ObtianApiList>
</template>

<script>
import ObtianApiList from './obtain_api_list';
import ButtonWrapper from '../mytask/ButtonWrapper';

export default {
    components: {ObtianApiList: ObtianApiList},
    data() {
        return {
            appname: 'pretask',
            pathname: 'prepagecolverifytask',
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
                    title: '状态',
                    key: 'status'
                },
            ],
        }
    }

}
</script>
