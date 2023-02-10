<template>
  <div class="collection">
    <div class="titleBar">
      <h2>我的收藏 ({{ collectionLength }})</h2>
      <div class="checkAll">
        查看全部
        <img src="@/assets/icons/lookAll.png" alt="">
      </div>
    </div>
    <img src="@/assets/icons/noneCollect.png" class="noneCollect" v-if="collectionLength == 0">

    <div class="collectList">
      <div class="collectionItem" v-for="item in collection" :key="item.book_id">
        <img :src="item.thumb" alt="">
        <div class="scriptName">{{ item.book_name }}</div>
      </div>
    </div>
  </div>

</template>

<script>
import { myCollection } from '@/requests/mine'
export default {
  data() {
    return {
      collection: null
    }
  },

  async mounted() {
    let result = await myCollection();
    // console.log(result);
    this.collection = result.data.data.data
    // console.log(this.collection.length);
  },

  computed: {
    collectionLength() {
      if (this.collection) {
        return this.collection.length;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.titleBar {
  width:970px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 16px ;

  h2 {
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }

  .checkAll {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #9e9e9e;
    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
      margin-left: 8px;

    }
  }
}

.collection {
  width: 970px;
  img {
    width: 124px;
    height: 160px;
    border-radius: 6px;
  }

  .noneCollect {
    display: block;
    margin: 200px auto;
    user-select: none;
  }
}

.collectList {
  display: flex;
  flex-wrap: wrap;
  
  .collectionItem {
    margin-right:12px;
    &:nth-child(7n) {
      margin:0;
    }
    img {
      border-radius: 6px;
      overflow: hidden;
    }
    .scriptName {
      font-size: 15px;
      color:#555;
    }
  }
}
</style>