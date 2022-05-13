import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

import { useAdapter, initCloud } from './util/cloud.js'
import { adapters } from './util/adapters.js'
useAdapter({ adapters, platform: 'uin-app' })
const wxcloud = initCloud()

const wxcloudConfig = {
	appid:'wxxxxxxxxxxxxx', // 公众号appid
	scope:'snsapi_base', // 登录授权类型
	resourceAppid: 'wxxxxxxxxxxxxx', // 云托管环境ID所属资源方账号appid，资源复用或者自己
	resourceEnv: 'prod-xxxx' // 云托管环境ID
}
wxcloud.checkLogin({
	provider: 'OfficialAccount',
	appid: wxcloudConfig.appid,
}).then(async res=>{
	console.log('登录状态',res)
	if(res.loggedIn==false){
		wxcloud.startLogin({
			provider: 'OfficialAccount',
			appid: wxcloudConfig.appid,
			scope: wxcloudConfig.scope,
			redirectUri: window.location.href,
		})
	} else {
		App.mpType = 'app'
		const app = new Vue({ ...App })
		app.cloud = wxcloud.Cloud(wxcloudConfig)
		await app.cloud.init()
		app.$mount()
	}
})
