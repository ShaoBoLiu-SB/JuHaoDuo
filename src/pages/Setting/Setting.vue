<template>
  <div class="setting">
    <div class="uselessBar">
      <div class="contentBox">
        <img src="@/assets/icons/setting.png">
        <span>账号设置</span>
      </div>
    </div>

    <div class="contentArea">
      <div class="content">
        <div class="menuBar">
          <div class="avatarBox">
            <img :src="userAvtar" v-if="userAvtar" class="avatar">
            <img src="@/assets/imgs/avatar1.png" class="avatar" v-else>
            <span>{{ userName }}</span>
          </div>
          <div class="menu" v-for="(item, index) in menuBar" :key="index" @click="menuClick(index)"
            :class="{ actMenu: index == actMenuIndex }">{{ item }}</div>
        </div>

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actMenuIndex: 0,
      menuBar: ['基本资料', '修改头像', '修改密码', '更改手机号', '个人信息保护政策']
    }
  },
  methods: {
    menuClick(index) {
      this.actMenuIndex = index;
      let router = this.$router;
      if (index == 0) {
        router.push('/setting/basicdata')
      }
      if (index == 1) {
        router.push('/setting/altavatar')
      }
      if (index == 2) {
        router.push('/setting/altpwd')
      }
      if (index == 3) {
        router.push('/setting/altphone')
      }
      if (index == 4) {
        router.push('/setting/messagepolicy')
      }
    }
  },
  computed: {
    userName() {
      return localStorage.getItem('userName')
    },
    userAvtar() {
      return localStorage.getItem('avatarUrl')
    }
  }
}
</script>

<style lang="less" scoped>
.setting {
  background-color: #fafafa;

  .uselessBar {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: url(@/assets/imgs/bg.png) center center;
    background-size: 100% auto;

    .contentBox {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;

      img {
        width: 20px;
        margin-right: 10px;
      }
    }
  }

  .contentArea {
    width: 100%;
    height: 100vh;
    background-color: #fafafa;

    .content {
      width: 1200px;
      margin: 24px auto;
      display: flex;

      .menuBar {
        width: 212px;
        height: 500px;
        background-color: white;
        margin-right: 32px;

        .avatarBox {
          text-align: center;
          padding: 32px 0 20px;
          margin-bottom: 20px;
          .avatar {
            width:40px;
            height: 40px;
            border-radius: 30px;
          }

          span {
            display: block;
            white-space: nowrap;
            margin-top: 16px;
            color: #333;
            font-size: 18px;
          }
        }

        .menu {
          width: 100%;
          height: 40px;
          line-height: 40px;
          box-sizing: border-box;
          text-align: center;
          margin: 10px 0;
          cursor: pointer;
          color: #666666;
          font-size: 14px;
        }

        .actMenu {
          background-color: #fff6ed;
          position: relative;
          color: #F87D00;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            width: 3px;
            height: 40px;

            background-color: #f87d00;
          }
        }
      }
    }

  }
}
</style>