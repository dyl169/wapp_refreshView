// components/listView/listView.js

var util = require('./util.js');

Component({
    /**
     * 外部样式
     */
	externalClasses: ['custom-class'],

    /**
     * 组件的属性列表
     */
	properties: {
		//是否需要刷新
		refresh: {
			type: Boolean,
			value: true,
		},
		//是否需要加载更多
		loadMore: {
			type: Boolean,
			value: true,
		},
		//数据长度
		length: {
			type: Number,
			value: 0,
		},
		//空数据显示
		emptyText: {
			type: String,
			value: '没有数据~',
		},
		noMore: {
			type: Boolean,
			value: false,
		},
		noMoreText: {
			type: String,
			value: '没有更多了~',
		}
	},

    /**
     * 组件的初始数据
     */
	data: {
		EVENT_REFRESH: 'onRefresh',
		EVENT_LOADMORE: 'onLoadMore',
		rotateAngle: 0,
		scrollY: true,//默认true
		state: 0, //控件的状态 0:无状态 1:下拉中 2:下拉达到刷新条件 3:下拉刷新中 4:上拉中 5:上拉加载中 6:加载失败
		scrollToTop: true, //是否到顶部了
		scrollToBottom: false, //是否到底部了
	},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
	ready: function () {
		var that = this;
		util.queryView(this, '.listView_box_header', function (res) {
			var scale = 80 / res.height;
			that.data.headHeight = res.height * scale;
			that.data.headHeightDef = res.height * scale;
		});

		util.queryView(this, '.listView_box', function (res) {
			that.setData({
				bottom: res.bottom,
			})
		});
	},

    /**
     * 组件的方法列表
     */
	methods: {
        /**
         * 滚动事件
         */
		scrollListener: function (e) {
			if (e.detail.scrollTop == 0) {
				//到顶部了
				this.data.scrollToTop = true;
			} else {
				//离开顶部了
				this.data.scrollToTop = false;
			}
		},
        /**
         * 滚动到顶部
         */
		scrollTopListener: function (e) {
			this.data.scrollToTop = true;
			this.data.scrollToBottom = false;
		},
        /**
         * 滚动到底部
         */
		scrollBottomListener: function (e) {
			//加载更多
			if (this.data.state != 3
				&& this.data.state != 5
				&& this.data.length != null && this.data.length > 0
				&& this.data.loadMore
				&& !this.data.noMore) {
				console.log('触发加载更多')
				this.data.scrollToTop = false;
				this.data.scrollToBottom = true;
				this.data.state = 5;
				this.data.headHeight = this.data.headHeightDef;
				this.setData(this.data);
				this.sendEvent(this.data.EVENT_LOADMORE);
			}
		},
        /**
         * 手指点击
         */
		touchStart: function (e) {
			this.data.touchStartY = e.touches[0].pageY;
			console.log('touchStart' + this.data.touchStartY);
			this.triggerEvent('bindScrollTouchStart');
		},
        /**
         * 手指滑动
         */
		touchMove: function (e) {

			//1.计算出下拉的间距
			var dropDownInterval = (e.touches[0].pageY - this.data.touchStartY);
			this.data.rotateAngle = dropDownInterval / this.data.headHeightDef * 90;
			if (this.data.rotateAngle > 180) {
				this.data.rotateAngle = 180;
			}

			//2.下拉时
			if (dropDownInterval > 0
				&& this.data.scrollToTop
				&& this.data.state != 3
				&& this.data.state != 5
				&& this.data.refresh) {
				this.setData({
					scrollY: false,
				})
				//3.没有在加载的时候去计算head和margin-top 
				if (this.data.state != 3 && this.data.state != 5) {
					var marginTop = -this.data.headHeightDef + (dropDownInterval);
					this.data.headMarginTop = marginTop > 0 ? 0 : marginTop;
				}

				//2.当下拉的高度大于等于head的高度
				if (dropDownInterval >= this.data.headHeightDef && this.data.state != 3 && this.data.state != 5) {
					//下拉的最大高度
					if (dropDownInterval > 200) {
						dropDownInterval = 200;
					}
					this.data.headHeight = dropDownInterval;

					//3.当下拉达到下拉刷新的条件时
					if (e.touches[0].pageY > this.data.touchStartY &&
						this.data.headHeight + this.data.headMarginTop > this.data.headHeightDef &&
						this.data.state == 1) {
						this.data.state = 2;
					}
				} else {
					//3.当是下拉
					this.data.state = 1;//下拉中
				}
			} else if (this.data.state != 3 && this.data.state != 5) {
				this.data.state = 4;//上拉中
			}
			console.log(this.data.state);
			this.setData(this.data);
		},
        /**
         * 手指松开
         */
		touchEnd: function (e) {
			this.setData({
				scrollY: true,
			})
			if (this.data.state == 2) {
				//触发刷新
				this.data.state = 3;
				this.data.headHeight = this.data.headHeightDef;
				this.data.scrollTop = 0;
				this.sendEvent(this.data.EVENT_REFRESH);
				this.setData(this.data);
			} else if (this.data.headMarginTop <= 0 && this.data.state == 1 || this.data.state == 4) {
				this.resetState();
			}
		},
		//重置状态
		resetState: function () {
			console.log('重置状态')
			//重置状态
			this.data.state = 0;
			this.data.headMarginTop = -this.data.headHeightDef;
			this.data.headHeight = this.data.headHeightDef;
			this.setData(this.data);
		},
		//动态改变scroll-y的值 防止下拉时触发scroll-view的阻尼效果
		setScrollY: function (state) {
			this.data.scrollY = state;
			this.setData({
				scrollY: this.data.scrollY,
			})
		},
		//发送事件
		sendEvent: function (eventType) {
			var that = this;
			this.triggerEvent(eventType, {
				success: function () {
					if (eventType == that.data.EVENT_REFRESH && that.data.state == 3) {
						that.data.scrollToTop = true;
						that.data.scrollToBottom = false;
						that.data.scrollTop = 0;
					} else if (eventType == that.data.EVENT_LOADMORE && that.data.state == 5) {
						that.data.scrollToTop = false;
						that.data.scrollToBottom = true;
					}
					that.resetState();
				},
				fail: function () {
					that.data.state = 6;
					that.setData(that.data);
					setTimeout(function () {
						if (eventType == that.data.EVENT_REFRESH && that.data.state == 3) {
							that.data.scrollToTop = true;
							that.data.scrollToBottom = false;
							that.data.scrollTop = 0;
							that.setData(that.data);
						} else if (eventType == that.data.EVENT_LOADMORE && that.data.state == 5) {
							that.data.scrollToTop = false;
							that.data.scrollToBottom = true;
							that.setData(that.data);
						}
						that.data.state = 0;
						that.resetState();
					}, 2000)
				},
			})
		},
	}
})