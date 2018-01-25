<style scoped> </style>>

<template>
<TaskList :viewRouteName="view" :dataUrl="url"></TaskList>
</template>

<script>
import TaskList from './TaskList';

export default {
    components: {TaskList: TaskList},

    computed: {
      url() {
        return '/api/deltask/history/';
      },
      view() {
        return 'checkdel';
      }
    },
}
</script>
