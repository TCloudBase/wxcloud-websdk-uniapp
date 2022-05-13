const {
	adapterWrapper
} = require('./cloud')

export class webSocketClass {
	_socketTask

	constructor(url, protocols) {
		this._socketTask = uni.connectSocket({
			url,
			protocols: protocols || []
		})
		this._socketTask.onSocketOpen(this._getCb('onopen'))
		this._socketTask.onSocketClose(this._getCb('onclose'))
		this._socketTask.onSocketMessage(this._getCb('onmessage'))
		this._socketTask.onSocketError(this._getCb('onerror'))
	}

	get readyState() {
		return this._socketTask.readyState
	}

	send(data) {
		this._socketTask.sendSocketMessage({
			data
		})
	}

	close(code, resaon) {
		this._socketTask.closeSocket() // { code: code || 1000, reason: resaon || ''}
	}

	_getCb(key) {
		return (res) => {
			const fn = this[key]
			if (fn && typeof fn === 'function') fn(res)
		}
	}
}

export const storage = {
	setItem: (key, data) => {
		uni.setStorageSync(key, data)
	},
	getItem: (key) => {
		return uni.getStorageSync(key)
	}
}

export const network = {
	getNetWorkType: () => 'wifi',
	onNetworkStatusChange: (cb) => {
		uni.onNetworkStatusChange(cb)
	}
}

uni.getNetworkType({
	success: function(res) {
		network.getNetWorkType = res.networkType
	},
	fail: function(res) {
		network.getNetWorkType = 'unknown'
	}
});

export const reqClass = adapterWrapper.requestAdapterWrapper((request, responseCallback) => {
	let con = {
		method: request.method,
		url: request.url,
		dataType: request.dataType,
		header: request.headers,
		data: request.body || {},
		responseType: request.responseType,
		success(res) {
			if (request.responseType !== 'arraybuffer') res.data = JSON.stringify(res.data).replace(/'/g,
				'"')
			responseCallback({
				statusCode: res.statusCode,
				response: res.data,
				headers: res.header,
				statusMessage: res.errMsg
			})
		},
		fail(res) {
			responseCallback({
				statusCode: res.statusCode || 0,
				statusMessage: res.errMsg
			})
		}
	}
	uni.request(con)
})

export const adapters = {
	sessionStorage: storage,
	localStorage: storage,
	network,
	reqClass,
	webSocketClass
}
