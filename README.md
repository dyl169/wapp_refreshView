# wapp_refreshView
一个在微信小程序中使用的上下拉刷新组件

小程序代码片段: wechatide://minicode/Iw0WABm37T2P 

效果：
![Alt text](https://github.com/dyl169/wapp_refreshView/blob/master/123.gif "效果图")

参数：

|参数名|类型|说明|
|:-----  |:-----|-----                           |
| custom-class | 自定义样式class-name | 自定义样式 |
| refresh |boolean   |是否需要刷新|
| loadMore |boolean   |是否需要加载更多|
| length |number   |数据长度|
| emptyText |string   |数据为空时的提示|
| noMore |boolean   |是否没有更多了|
| noMoreText |string   |没有更多数据时的提示|
| bind:onLoadMore |回调   |刷新时回调|
| bind:onRefresh |回调   |加载更多时回调|

```
例：刷新&加载更多
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

```
