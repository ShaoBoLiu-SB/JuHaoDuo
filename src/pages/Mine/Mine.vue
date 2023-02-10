<template>
  <div class="mine">
    <div class="location">位置: <a> 个人中心</a></div>
    <div class="content">
      <!-- 左侧的控制栏, 负责跳转 -->
      <div class="controlBar">
        <!-- 设置按钮 -->
        <div class="setting" @click="$router.push('/setting')">
          <img src="@/assets/icons/setting.png">
          <span>设置</span>
        </div>

        <!-- 头像区域 -->
        <div class="avatarBox">
          <img :src="avatar" v-if="avatar">
          <img src="@/assets/imgs/avatar1.png" v-else>
          <div class="userName">{{ userName }}</div>
        </div>

        <!-- 左侧的菜单栏 -->
        <div class="menuBar">
          <div class="menuItem" v-for="(item, index) in menuBar" :key="index" @click="menuClick(index)">
            <div class="iconBox">
              <img :src="menuBar[index].act" v-if="index == currentMenuIndex">
              <img :src="menuBar[index].default" v-else>
            </div>
            <div class="title" :class="{ activeTitle: index == currentMenuIndex }">{{ menuBar[index].title }}</div>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentMenuIndex: 0,
      isMineFlag: true,
      menuBar: [
        {
          default: require('@/assets/icons/home.png'),
          act: require('@/assets/icons/home-tab-act.png'),
          title: '我的主页'
        },
        {
          default: require('@/assets/icons/collects.png'),
          act: require('@/assets/icons/collects-tab-act.png'),
          title: '我的收藏'
        },
        {
          default: require('@/assets/icons/history.png'),
          act: require('@/assets/icons/history-tab-act.png'),
          title: '最近浏览'
        },
        {
          default: require('@/assets/icons/wallet.png'),
          act: require('@/assets/icons/wallet-tab-act.png'),
          title: '我的钱包'
        },
        {
          default: require('@/assets/icons/transaction.png'),
          act: require('@/assets/icons/transaction-tab-act.png'),
          title: '交易记录'
        },
      ]
    }
  },
  methods: {
    menuClick(index) {
      this.currentMenuIndex = index;
      if (index == 0) {
        this.$router.replace('/mine/usermessage')
      } else if (index == 1) {
        this.$router.replace('/mine/collection')
      } else if (index == 2) {
        this.$router.replace('/mine/history')
      } else if (index == 3) {
        this.$router.replace('/mine/wallet')
      } else if (index == 4) {
        this.$router.replace('/mine/transaction')
      }
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('userName')
    },
    avatar() {
      return localStorage.getItem('avatarUrl')
    }
  },
  mounted() {
    // 解决一下刷新页面提示初始化问题
    if (this.isMineFlag) {
      this.$store.commit('changeActiveIndex', -1)
    }


    // 解决一下路由页面刷新跳转,currentMenuIndex初始化和不变化的问题
    let route = this.$route
    // console.log(route);
    /*     if (route.params.currentMenuIndex) {
          this.currentMenuIndex = route.params.currentMenuIndex;
          console.log(route);
        } */
    if (route.path == '/mine/usermessage') {
      this.currentMenuIndex = 0
    }
    if (route.path == '/mine/collection') {
      this.currentMenuIndex = 1
    }
    if (route.path == '/mine/history') {
      this.currentMenuIndex = 2
    }
    if (route.path == '/mine/wallet') {
      this.currentMenuIndex = 3
    }
    if (route.path == '/mine/transaction') {
      this.currentMenuIndex = 4
    }
  }
}
</script>

<style lang="less" scoped>
.mine {
  width: 1200px;
  margin: 0 auto 35px;

  .location {
    margin: 32px 0 24px;
    color: #666;
    font-size: 14px;

    a:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .content {
    display: flex;

    .controlBar {
      width: 206px;
      height: 620px;
      border-radius: 8px;
      box-shadow: 0px 3px 30px 0px rgba(0, 0, 0, 0.16);
      position: relative;
      margin-right: 24px;

      .setting {
        position: absolute;
        right: 5px;
        top: 5px;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          margin-right: 4px;
        }

        span {
          color: #666;
          font-size: 12px;

        }
      }

      .avatarBox {
        // width: 88px;
        text-align: center;
        margin: 0 auto;
        padding: 62px 0 64px;

        img {
          margin: 0 auto;
          width: 80px;
          height: 80px;
          border-radius: 40px;
        }

        .userName {
          position: relative;
          margin-top: 16px;
          white-space: nowrap;
          color: #666666;
          font-weight: bold;

          &::after {
            content: '';
            height: 1px;
            width: 88px;
            background-color: #e5e5e5;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 60px;
          }
        }
      }

      .menuBar {
        margin-top: 20px;

        .menuItem {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 25px 0;
          cursor: pointer;

          .iconBox {
            margin-right: 4px;
          }

          .title {
            margin-left: 4px;
            color: #666;
          }

          .activeTitle {
            color: #FF7E1D;
          }
        }
      }
    }
  }
}
</style>