<template>
  <div class="topNav">
    <!-- 顶部导航 -->
    <header>
      <!-- logo -->
      <div class="iconBox" @click="iconLink"><img src="@/assets/logo.png" alt="" /></div>
      <!-- 菜单栏 -->
      <div class="menuTabs">
        <div class="tab" v-for="(tab, index) in tabs" :key="tab" @click="routerLink(index)"
          :class="{ activeTab: activeIndex == index }">
          {{ tab }}
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="inputBox">
        <input type="text" placeholder="请输入剧本或作者名" />
        <div class="searchButton">
          <img src="@/assets/icons/search.png" alt="" />
        </div>
      </div>
      <!-- 登录和注册 -->
      <div class="loginBox">
        <!-- 没登录的状态显示登录注册按钮 -->
        <div class="notLogin" v-if="!isLogin">
          <button @click="changeLoginShow">登录</button>
          <!-- <button>注册</button> -->
        </div>

        <!-- 登录之后显示用户信息 -->
        <div class="logined" v-if="isLogin">
          <img src="@/assets/icons/bell.png" @click="$router.push('/message')" style="cursor:pointer;">
          <!-- 头像 -->
          <div class="avatarBox" @mouseover="userMenuShow = true" >
            <img :src="avatar" class="avatar" v-if="avatar">
            <img src="@/assets/imgs/avatar1.png" class="avatar" v-else>
          </div>
          <span v-if="!username">个人中心</span>
          <!-- <span v-else>{{ username }}</span> -->
          <!-- <span class="userName" @click="userMenuShow = !userMenuShow" v-if="username">{{ username }}</span>
          <span class="userName" @click="userMenuShow = !userMenuShow" v-else>用户名称</span> -->
          <!-- <div class="triangle" :class="{ showStatus: userMenuShow }" @click="userMenuShow = !userMenuShow"></div> -->

          <!-- 点击头像出现的扩展菜单 -->
          <div class="userMenu" v-show="userMenuShow" @mouseleave="userMenuShow = false">
            <!-- 没啥用的头像 -->
            <div class="userNameTitle">
              <img :src="avatar" class="avatar" v-if="avatar">
              <img src="@/assets/imgs/avatar1.png" class="avatar" v-else>
              {{ username }}
            </div>
            <!-- 下方的菜单盒子六个 -->
            <div class="menuBoxes">
              <div class="menuBox" v-for="(item, index) in icons" :key="index" @mouseover="actMenuBoxIndex = index"
                @mouseleave="actMenuBoxIndex = -1" :class="{ hoverMenuBox: index == actMenuBoxIndex }"
                @click="menuBoxLink(index)">
                <div class="iconBox">
                  <img :src="icons[index].act" v-if="index == actMenuBoxIndex">
                  <img :src="icons[index].default" v-else>
                </div>
                <span>{{ icons[index].name }}</span>
              </div>
            </div>

            <!-- 账号设置&退出账号 -->
            <div class="setout">
              <a @click="$router.push('/setting')">账号设置</a>
              <a @click="singout">退出账号</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tabs: ["首页", "剧本", "作者专区", "关于我们"],
      currentTabIndex: 0,
      username: null,
      userMenuShow: false,
      icons: [
        {
          default: require('@/assets/icons/home.png'),
          act: require('@/assets/icons/home-act.png'),
          name: '我的主页'
        },
        {
          default: require('@/assets/icons/collects.png'),
          act: require('@/assets/icons/collects-act.png'),
          name: '我的收藏'
        },
        {
          default: require('@/assets/icons/history.png'),
          act: require('@/assets/icons/history-act.png'),
          name: '最近浏览'
        },
        {
          default: require('@/assets/icons/author.png'),
          act: require('@/assets/icons/author-act.png'),
          name: '作者主页'
        },
        {
          default: require('@/assets/icons/wallet.png'),
          act: require('@/assets/icons/wallet-act.png'),
          name: '我的钱包'
        },
        {
          default: require('@/assets/icons/transaction.png'),
          act: require('@/assets/icons/transaction-act.png'),
          name: '交易记录'
        },
      ],
      actMenuBoxIndex: -1,
    };
  },
  mounted() {
    // username = localStorage.getItem('userName')
    let token = localStorage.getItem('userToken')
    if (token) {
      this.$store.commit('changeLogin', true)
    }
    this.username = localStorage.getItem('userName')
    // console.log(this.$route);
  },
  methods: {
    // 点击网站icon可以跳转回首页
    iconLink() {
      this.$router.push('/home')
      this.$store.commit('changeActiveIndex', 0)
    },
    // 菜单栏路由跳转 和 active样式
    routerLink(index) {
      this.$store.commit('changeActiveIndex', index)
      if (index == 0) {
        this.$router.push("/home");
      }
      if (index == 1) {
        this.$router.push("/script");
      }
      if (index == 2) {
        this.$router.push("/author");
      }
      if (index == 3) {
        this.$router.push("/about");
      }
    },
    // 点击登录 展示登录组件
    changeLoginShow() {
      this.$store.commit("changeLoginShow");
      // console.log(this.$store);
    },
    // 点击分类或者点击全部分类,跳转到剧本
    toScripts() {
      this.currentTabIndex = 1;
      this.$router.push("/script");
    },
    // 退出登录(清缓存, 通知vuex退出登录)
    singout() {
      localStorage.clear();
      this.$store.commit('changeLogin', false);
      // 清除登录信息和修改登录状态, 然后要保证不能进入和登录过后相关的页面
      let path = this.$route.path;
      if (path == '/home' || path == '/script' || path == '/about' || path == '/scriptdetail') {
        return
      } else {
        this.$router.push('/home')
      }
    },
    // 点击菜单盒子跳转相应的路由
    menuBoxLink(index) {
      // 跳转到不属于导航栏的页面, 要把光标改一下`
      this.$store.commit('changeActiveIndex', -1)
      if (index == 0) {
        this.$router.push('/mine')
      }
      if (index == 1) {

        this.$router.push('/mine/collection')
      }
      if (index == 2) {
        this.$router.push('/mine/history')
      }
      if (index == 3) {
        this.$router.push('/author')
      }
      if (index == 4) {
        this.$router.push('/mine/wallet')
      }
      if (index == 5) {
        this.$router.push('/mine/transaction')
      }
    }
  },
  computed: {
    activeIndex() {
      return this.$store.state.home.activeIndex
    },
    isLogin() {
      return this.$store.state.home.isLogin;
    },
    // username() {
    //   let username = localStorage.getItem('userName')
    //   // if (username == null || username == undefined) {
    //   //   this.$store.commit('changeLogin', true)
    //   // }
    //   return username;
    // },
    avatar() {
      return localStorage.getItem('avatarUrl')
    }
  },
  watch: {
    userToken() {
      // console.log('change');
    }
  }
};
</script>

<style lang="less" scoped>
.topNav {
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #E5E5E5;
  box-shadow: 0 2px 10px 0 #1b0e0017;

  // 顶部导航
  header {
    width: 1200px;
    height: 68px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .iconBox {
      width: 112px;
      height: 42px;
      cursor: pointer;
      user-select: none;

      img {
        width: 100%;
      }
    }

    .menuTabs {
      height: 100%;
      display: flex;
      align-items: center;

      .tab {
        padding: 20px 17px;
        margin: 0 29px;
        color: #555555;
        font-size: 16px;
        cursor: pointer;
        transition: all .3s;

        &:hover {
          color: #F87D00;
        }
      }

      .activeTab {
        position: relative;
        color: #333;
        font-weight: 550;

        &::after {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          content: '';
          width: 24px;
          height: 3px;
          background-color: #F87D00;
          border-radius: 3px;
        }
      }
    }

    .inputBox {
      width: 251px;
      height: 36px;
      border-radius: 21px;
      background-color: #F0F0F0;
      overflow: hidden;
      display: flex;
      cursor: pointer;

      input {
        flex: 1;
        border: none;
        outline: none;
        background-color: #F0F0F0;
        text-indent: 1em;
        color: black;
        font-size: 14px;

        ::-webkit-input-placeholder {
          color: #9e9e9e;
        }
      }

      .searchButton {
        width: 45px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        color: white;
        user-select: none;

        span {
          margin-left: -7px;
        }
      }
    }

    .loginBox {
      user-select: none;
      display: flex;
      align-items: center;

      button {
        width: 68px;
        height: 30px;
        border-radius: 34px;
        cursor: pointer;

        &:first-child {
          background-color: #393939;
          color: white;
          margin-right: 16px;
        }

        &:last-child {
          background-color: #f4f4f4;
          color: #1a1a1a;
        }
      }

      .logined {
        display: flex;
        align-items: center;

        .avatarBox {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background-color: cadetblue;
          margin-left: 20px;
          outline:2px solid rgb(216, 216, 216);

          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            cursor: pointer;
          }
        }

        span {
          color: #9E9E9E;
          font-size: 14px;
          margin-left: 4px;
          cursor: pointer;
        }

        .userName {
          color: #333;
          font-size: 14px;
        }

        .triangle {
          margin-left: 8px;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          // border-top: 10px solid #333;
          border-bottom: 12px solid #333;
          border-radius: 2px;
          cursor: pointer;
          transition: all .3s;
        }

        .showStatus {
          transform: rotate(180deg);
        }

        .userMenu {
          z-index: 999;
          position: absolute;
          top: 70px;
          transform: translateX(-40px);
          width: 320px;
          height: 288px;
          border-radius: 4px;
          background-color: white;
          box-shadow: 0px 2px 12px 0px rgba(68, 26, 4, 0.12);

          .userNameTitle {
            box-sizing: border-box;
            width: 100%;
            height: 80px;
            background-color: #FFF6F1;
            padding: 0 20px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;


            img {
              width: 40px;
              height: 40px;
              border-radius: 40px;
              margin-right: 8px;
            }
          }

          .menuBoxes {
            display: flex;
            justify-content: space-evenly;
            flex-wrap: wrap;

            .menuBox {
              width: 25%;
              height: 68px;
              border-radius: 4px;
              margin: 10px 10px 0px 10px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              cursor: pointer;

              .iconBox {
                width: 22px;
                height: 22px;
                margin-bottom: -15px;

                img {
                  width: 22px;
                }
              }

              span {
                color: #666;
                margin-top: 20px;
              }

            }

            .hoverMenuBox {
              background-color: #FA7E02;

              span {
                color: white;
              }
            }
          }

          .setout {
            width: 272px;
            border-top: 1px solid #ededed;
            height: 70px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            padding-top: 12px;
            box-sizing: border-box;

            a {
              cursor: pointer;
              font-size: 14px;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>