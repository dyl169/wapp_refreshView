const app = getApp()

Page({
  data: {
	  listData:[ 1,2,3,4,5,6,7,8,9,10]
  },
  onLoad: function () {
  },
	onRefresh:function(e){
		var callback = e.detail;
		setTimeout(function(){
			callback.success();
		},3000)
	},
	onLoadMore: function (e) {
		var callback = e.detail;
		setTimeout(function () {
			callback.fail();
		}, 3000)
	},

})
