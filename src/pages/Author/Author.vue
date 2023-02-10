<template>
  <!-- 作者专区 -->
  <div class="author">
    <div class="tabMenuBar">
      <div class="tab" v-for="(item, index) in tabMenuBar" :key="index" :class="{ actTab: index == currentIndex }"
        @click="tabClick(index)">
        <img :src="tabMenuBar[index].act" v-if="index == currentIndex">
        <img :src="tabMenuBar[index].default" v-else>
        {{ tabMenuBar[index].title }}
      </div>
    </div>
    <router-view style="margin-left:100px;"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      tabMenuBar: [
        {
          default: require('@/assets/icons/createCenter.png'),
          act: require('@/assets/icons/createCenter-act.png'),
          title: '创作中心'
        },
        {
          default: require('@/assets/icons/worksAdmain.png'),
          act: require('@/assets/icons/worksAdmain-act.png'),
          title: '作品管理'
        },
        {
          default: require('@/assets/icons/income.png'),
          act: require('@/assets/icons/income-act.png'),
          title: '收入管理'
        },
        // {
        //   default: require('@/assets/icons/dataAly.png'),
        //   act: require('@/assets/icons/dataAly-act.png'),
        //   title: '数据分析'
        // }
      ]
    }
  },
  mounted() {
    this.$store.commit('changeActiveIndex', 2)
  },
  methods: {
    tabClick(index) {
      this.currentIndex = index;
      let router = this.$router
      if (index == 0) {
        router.push('/author/createcenter')
      }
      if (index == 1) {
        router.push('/author/worksadmain')
      }
      if (index == 2) {
        router.push('/author/income')
      }
      if (index == 3) {
        router.push('/author/dataaly')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.author {
  width: 1200px;
  margin: 55px auto 0;
  display: flex;

  .tabMenuBar {
    position: relative;

    &::after {
      content: '';
      width: 2px;
      height: 125px;
      background-color: #FA7E02;
      position: absolute;
      top: 0;
      right: -35px;
    }

    .tab {
      display: flex;
      align-items: center;
      margin-bottom: 27px;
      white-space: nowrap;
      cursor: pointer;

      img {
        margin-right: 8px;
      }
    }

    .actTab {
      color: #FA7E02
    }
  }
}
</style>