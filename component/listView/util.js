module.exports = {
	//获取节点信息
	queryView: function (context,name, success) {
		const query = wx.createSelectorQuery().in(context)
		query.select(name).boundingClientRect(function (res) {
			success(res);
		}).exec()
	}
}