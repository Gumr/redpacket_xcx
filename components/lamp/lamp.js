// components/lamp/lamp.js
let internal = '';
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    lampData: {
      type: Array,
      value: [{
        nickName: '',
        prizeName: ''
      }],
      observer(newVal, oldVal) {
        this.startAnimate();
      }
    },
    color1: {
      type: String,
      value: '#fff'
    },
    color2: {
      type: String,
      value: '#F9CBA4'
    },
  },
  data: {
    showItem: true
  },
  attached() {
    // this.setItemStatus();
  },
  pageLifetimes: {
    show() {
      this.setData({
        showItem: true
      });
      this.startAnimate();
    },
    hide() {
      clearInterval(internal); // 组件所在页面隐藏时清除setInterval，是为了解决页面跳转后返回时setInterval带来的动画时差，在页面上bug提现为：两条数据更替时有跳动现象或者数据渲染延迟
      this.setData({
        showItem: false
      });
    }
  },
  methods: {
    setItemStatus() {
      if (this.data.lampData.length > 1) {
        setTimeout(() => {
          this.setData({
            showItem: false
          });
        }, 1800); // 添加showItem属性值是为了解决两条数据更替是页面延迟渲染的问题                                                  
      }
    },
    startAnimate() {
      const initArr = this.data.lampData;
      if (initArr.length > 1) { // 轮播总数大于1时，才执行数组首位删除并插入末尾操作
        internal = setInterval(() => {
          const firstEle = initArr[0];
          initArr.shift();
          initArr.push(firstEle);
          this.setData({
            lampData: initArr,
            showItem: true
          });
        }, 6000);
      }
    }
  }
});