<template>
  <div class="scriptSection">
    <div class="location">
      当前位置:&nbsp; <a>我要短剧本</a> > <a>短剧本</a>
    </div>

    <!-- 分类区域 -->
    <div class="categoryBox">
      <div class="category">
        <div class="cateTitle">分类:</div>
        <div class="cateItems" v-if="sortList" @click="getCateRes">
          <div class="cateItem" style="width: 84px" @click="actCateIndex = -1">
            <button :class="{ activeButton: actCateIndex == -1 }">全部</button>
          </div>
          <div
            class="cateItem"
            v-for="(item, index) in sortList"
            :key="index"
            @click="cate(index)"
          >
            <button :class="{ activeButton: index == actCateIndex }">
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="roleNumber">
        <div class="cateTitle">角色数量:</div>
        <div class="cateItems" @click="getCateRes">
          <div
            class="cateItem"
            v-for="(item, index) in characterNumber"
            :key="item"
            @click="roleCate(index)"
          >
            <button :class="{ activeButton: index == actRoleNumIndex }">
              {{ item }}
            </button>
          </div>
        </div>
      </div>

      <div class="shotSense">
        <div class="cateTitle">拍摄场景:</div>
        <div class="cateItems" @click="getCateRes">
          <div class="cateItem" @click="actSenseIndex = -1">
            <button :class="{ activeButton: actSenseIndex == -1 }">全部</button>
          </div>
          <div
            class="cateItem"
            v-for="(item, index) in sceneList"
            :key="index"
            @click="senseCate(index)"
          >
            <button :class="{ activeButton: index == actSenseIndex }">
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 剧本区域 -->
    <div class="scriptContent">
      <!-- 最新和最热的分类选项 -->
      <div class="titleBar">
        <span
          @click="changeTitleIndex(0)"
          :class="{ activeSpanTitle: activeSpanIndex == 0 }"
          >最热</span
        >
        <span
          @click="changeTitleIndex(1)"
          :class="{ activeSpanTitle: activeSpanIndex == 1 }"
          >最新</span
        >
      </div>

      <!-- 剧本内容贼多!!! -->
      <div class="scripts" v-if="cateResult">
        <div class="script" v-for="item in cateResult" :key="item.book_id">
          <div class="imgBox">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="rightText">
            <div class="nameAndPrice">
              <div class="scriptName" @click="toScriptDetail(item.book_id)">
                《{{ item.book_name }}》
              </div>
              <div class="price">后台没有价格</div>
            </div>
            <div class="desc">{{ item.intro }}</div>
            <div class="tagAndCollect">
              <div class="tag">{{ scriptTag(item.sort_id) }}</div>
              <div class="collect">
                收藏数: <span>{{ item.collectnum }}</span>
              </div>
            </div>
            <div class="authorAndTime">
              <div class="author">
                <div class="authorAvatar"></div>
                <div class="authorName">{{ item.author }}</div>
              </div>
              <div class="time">{{ item.update_time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination
          prev-text="上一页"
          next-text="下一页"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="getPageAndReq"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { reqSortList, getCateScript } from "@/requests/category";
export default {
  data() {
    return {
      actCateIndex: -1, //默认为-1:全部
      actRoleNumIndex: 0, //默认为0:全部,为了排序index, 上传的时候要-1
      actSenseIndex: -1, //默认为-1: 全部
      activeSpanIndex: 0, //默认为0:最热
      sceneList: null,
      sortList: null,
      characterNumber: [
        "全部",
        "无",
        "1个",
        "2个",
        "3个",
        "4个",
        "5个",
        "更多人数",
      ],
      timer: null,
      page: 1, //当前页 默认是1
      cateResult: [], //分类请求的结果
      last_page: null, //这次的分类请求总共多少页
      total: null, //这次请求总共多少条数据
    };
  },

  async mounted() {
    let result = await reqSortList();
    // console.log(result, "获取分类列表");
    if (result.data.code == 0) {
      this.sceneList = result.data.data.SceneList;
      this.sortList = result.data.data.SortList;
    }

    // 挂载完就调用一下?
    // this.getCateRes()
    this.getCateRes();
  },

  methods: {
    // 分类点击函数
    cate(index) {
      this.actCateIndex = index;
    },
    // 角色数量分类点击函数
    roleCate(index) {
      this.actRoleNumIndex = index;
    },
    // 拍摄场景分类
    senseCate(index) {
      this.actSenseIndex = index;
    },
    // 根据点击最热,最新进行分类,
    changeTitleIndex(flag) {
      // 最热分类
      if (flag == 0) {
        this.activeSpanIndex = 0;
      } else {
        this.activeSpanIndex = 1;
      }
      this.getCateRes();
    },
    // 根据点击的分类进行请求
    getCateRes() {
      let newHot = null;
      newHot = this.activeSpanIndex ? "new" : "hot";

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        // 首先当前是默认的的全部最热 选择那么应该是
        // -1, 0-1, -1
        // 如果分类是第一个那么就是 0+1
        let sort_id = this.actCateIndex;
        let role_number = this.actRoleNumIndex;
        let scene_id = this.actSenseIndex;
        // 如果当前"分类"选择的不是"全部" 那就应该+1
        if (sort_id != -1) {
          sort_id += 1;
        }
        // 如果当前"角色数量"选择的是"全部, 那么 -1
        if (role_number == 0) {
          role_number -=1
        }
        // 如果当前"场景"选择的不是全部 那么 +1
        if(scene_id != -1) {
          scene_id += 1
        }
        getCateScript(sort_id, role_number, scene_id, newHot, this.page).then(
          (res) => {
            // console.log(res, "!");
            this.cateResult = res.data.BookList.data;
            this.last_page = res.data.last_page;
            this.total = res.data.BookList.total;
          }
        );
      }, 500);
    },


    // 根据点击的分页器页号 调用请求
    getPageAndReq(val) {
      // 确定请求的是第几页
      this.page = val;
      // 发送请求
      this.getCateRes();
    },

    // 跳转到书籍详情页
    toScriptDetail(book_id) {
      this.$router.push({
        path: "/scriptdetail",
        query: {
          book_id,
        },
      });
    },

    // 获取每个剧本的标签
    scriptTag(sort_id) {
      sort_id = Number(sort_id);
      return this.sortList[sort_id - 1].name;
    },
  },

  computed: {},
};
</script>

<style lang="less" scoped>
@import url("@/assets/font.less");

.scriptSection {
  margin: 20px auto;
  width: 1200px;

  .location {
    font-size: 12px;
    color: #9e9e9e;

    a {
      cursor: pointer;

      &:hover {
        color: #ff9900;
        text-decoration: underline;
      }
    }
  }

  // 分类区域
  .categoryBox {
    height: 138px;
    margin-top: 30px;

    .category,
    .roleNumber,
    .shotSense {
      display: flex;
      align-items: center;
      height: 30px;

      .cateTitle {
        font-size: 14px;
        color: #9e9e9e;
        width: 105px;
        user-select: none;
        // background-color: pink;
      }

      .cateItems {
        display: flex;
        height: 30px;

        .cateItem {
          &:first-child {
            width: 100px;
          }

          display: flex;
          white-space: nowrap;
          align-items: center;
          width: 84px;

          // background-color: blue;
          button {
            // background-color: red;
            padding: 5px 16px;
            border-radius: 30px;
            font-size: 14px;
            color: #333;
            background-color: transparent;
            cursor: pointer;
            user-select: none;
          }

          .activeButton {
            background-color: #fef1e5;
            color: #f87d00;
          }
        }
      }
    }

    .roleNumber {
      margin: 24px 0;
    }
  }

  // 剧本区域
  .scriptContent {
    width: 1200px;
    margin: 30px auto;

    // 最新最热分类标题
    .titleBar {
      width: 100%;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e5e5;

      span {
        color: #999999;
        margin-right: 24px;
        cursor: pointer;
      }

      .activeSpanTitle {
        color: #333;
        font-weight: bold;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          width: 24px;
          height: 3px;
          border-radius: 10px;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #f87d00;
        }
      }
    }

    // 剧本内容贼多!!!
    .scripts {
      width: 1205px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 39px;

      .script {
        width: 380px;
        height: 136px;
        margin-bottom: 24px;
        margin-right: 24px;
        display: flex;

        &:nth-child(3n) {
          margin-right: 0;
        }

        .imgBox {
          width: 102px;
          height: 136px;
          border-radius: 4px;
          margin-right: 16px;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        .rightText {
          width: 266px;

          .nameAndPrice {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .scriptName {
              font-size: 18px;
              color: #333333;
              transform: translateX(-5px);
              white-space: nowrap;
              cursor: pointer;

              &:hover {
                text-decoration: underline;
              }
            }

            .price {
              font-family: robota;
              font-size: 14px;
              white-space: nowrap;
            }
          }

          .desc {
            color: #9e9e9e;
            font-size: 12px;
            margin-top: 8px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden; //溢出内容隐藏
            text-overflow: ellipsis; //文本溢出部分用省略号表示
            display: -webkit-box; //特别显示模式
            -webkit-line-clamp: 2; //行数
            line-clamp: 2;
            -webkit-box-orient: vertical; //盒子中内容竖直排列
          }

          .tagAndCollect {
            display: flex;
            justify-content: space-between;
            margin-top: 9px;

            .tag {
              padding:3px;
              text-align: center;
              line-height: 18px;
              color: #f87d00;
              font-size: 12px;
              border-radius: 4px;
              background-color: #feecd9;
            }

            .collect {
              font-size: 14px;
              color: #9e9e9e;

              span {
                font-family: robota;
              }
            }
          }

          .authorAndTime {
            display: flex;
            justify-content: space-between;
            margin-top: 11px;

            .author {
              display: flex;

              .authorAvatar {
                width: 20px;
                height: 20px;
                overflow: hidden;
                border-radius: 10px;
                background-color: pink;
              }

              .authorName {
                font-size: 14px;
                color: #9e9e9e;
                margin-left: 6px;
              }
            }

            .time {
              color: #9e9e9e;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  // 分页器
  .pagination {
    width: 1200px;
    margin: 30px auto 30px;
    text-align: center;

    /deep/ .el-pagination .btn-prev {
      padding: 5px;
      width: 72px;
      height: 28px;
      border: 1px solid #ccc;
      border-radius: 30px;
      background-color: #fff;

      span {
        line-height: 20px;
        color: #9e9e9e;
      }
    }

    /deep/ .el-pagination .btn-next {
      padding: 5px;
      width: 72px;
      height: 28px;
      border: 1px solid #ccc;
      border-radius: 30px;
      background-color: #fff;

      span {
        line-height: 20px;
        color: #9e9e9e;
      }
    }

    /deep/ .el-pagination .el-pager .number.active {
      background: #ff9900;
      color: #ffffff !important;
    }

    /deep/.el-pagination .el-pager .number {
      background-color: #fff;
      border-radius: 30px;
      border: 1px solid #cccccc;
      margin: 0 10px;
    }

    /deep/.el-pagination .el-pager .more {
      border-radius: 30px;
      background-color: #fff;
    }
  }
}
</style>