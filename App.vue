<script>
	export default {
		onLaunch: async function() {
			const res = await getApp().cloud.callContainer({
				path: '/', // 替换自己的路径
				header: {
					'X-WX-SERVICE': 'server', // 替换自己的服务名
					'content-type': 'application/json'
				},
				// dataType: 'text',
				method: 'POST'
			})
			console.log(res)
		}
	}
</script>

<style>
</style>
