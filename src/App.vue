<template>
  <div id="app">
    <TopNav></TopNav>
    <login></login>
    <router-view></router-view>
    <footer-bar></footer-bar>
    <div class="toTopArea">
      <div
        class="toTop"
        @click="goToTop"
        v-show="isToTop"
        @mouseleave="mouseleaveFn"
        @mouseover="isHover = true"
      >
        <img src="@/assets/icons/top.png" v-show="!isHover" />
        <img src="@/assets/icons/topHover.png" v-show="isHover" />
      </div>
      <div class="textTip" v-show="isHover">回到顶部</div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav/TopNav.vue";
import Login from "@/components/Login/Login.vue";
import FooterBar from "./components/FooterBar/FooterBar.vue";
export default {
  name: "App",
  data() {
    return {
      isToTop: false,
      isHover: false,
    };
  },
  methods: {
    // 回到顶部的方法
    goToTop() {
      // 拿到滚动值
      let top = document.documentElement.scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.documentElement.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 10);
    },
    // 鼠标移开
    mouseleaveFn() {
      this.isHover = false;
    },
    // 鼠标移入
    mouseoverFn() {
      this.isHover = true;
    },
  },
  mounted() {
    // 组件挂载完毕, 就添加一个检测鼠标滚动的事件
    window.addEventListener("scroll", () => {
      if (document.documentElement.scrollTop >= 200) {
        this.isToTop = true;
      } else {
        this.isToTop = false;
      }
    });
  },

  components: { TopNav, Login, FooterBar },
};
</script>

<style lang="less">
@import "./assets/font.less";
#nprogress .bar {
  background: #fa7e02 !important; //自定义颜色
}
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #fff;
  font-family: siyuan;
}

// 不能直接用固定定位定死这个回到首页
// 简单的解决方法,就是也写一个居中的1200px盒子,定位到这个盒子都右边
.toTopArea {
  width: 1200px;
  background-color: red;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  bottom: 50px;
}

// 回到顶部按钮
.toTop {
  position: absolute;
  right: -95px;
  bottom: 0px;
  width: 64px;
  height: 64px;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  &:hover {
    box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.1);
  }

  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

// 回到顶部文字提示
.textTip {
  position: absolute;
  bottom: 20px;
  right: -180px;
  width: 72px;
  height: 28px;
  text-align: center;
  font-size: 14px;
  color: #333;
  line-height: 28px;
  box-shadow: 0 2px 32px 0 rgba(0, 0, 0, 0.1);
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background-color: white;
    position: absolute;
    border-radius: 1px;
    left: -3px;
    top: 35%;
  }
}

/**滚动条的宽度*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/*滚动条的滑块*/
::-webkit-scrollbar-thumb {
  background-color: #ff9e3c;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #fa7e02;
}

button {
  border: none;
  outline: none;
}

input {
  border: none;
  outline: none;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
/* structural elements 结构元素 */

dl,
dt,
dd,
ul,
ol,
li,
/* list elements 列表元素 */

pre,
/* text formatting elements 文本格式元素 */

fieldset,
lengend,
button,
input,
textarea,
/* form elements 表单元素 */

th,
td {
  /* table elements 表格元素 */

  margin: 0;

  padding: 0;
}
</style>
