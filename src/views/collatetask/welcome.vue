<style></style>
<template>
	<Card style="width:320px;margin:auto;margin-top: 50px;">
        <div style="text-align:center">
        	<div slot="top" class="logo-con">
            <img src="../../images/logo-min.png">
        	</div>
            <h3>您还没有任务，请前往<a @click="pickTask">任务大厅</a>领取任务</h3>
        </div>
    </Card>
</template>
<script>
export default {
	methods: {
		pickTask () {
			return this.$router.push({name: this.$route.params.task + '-task'})
		}
	}
}
</script>