<style></style>
<template>
	<Card style="width:90%;height:90%;margin:auto;margin-top: 50px;">
        <div style="text-align:center;margin-top:10%">
        	<div slot="top" >
            <img src="../../images/welcome.png">
        	</div>
            <h2>您还没有任务<br>请前往<a @click="pickTask">任务大厅</a>领取任务</h2>
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