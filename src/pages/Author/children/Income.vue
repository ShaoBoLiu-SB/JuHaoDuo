<template>
  <div class="income">
    <!-- 标题栏 -->
    <div class="scriptTitleBar noBorder">
      <div class="leftTitle">收入查询</div>
      <div class="rightFn">
        <div class="lookAll">
          <span> 单位: 元</span>
          <span>截止日期: {{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- 统计表 -->
    <div class="countTable">
      <!-- 左边的剧本收益 和银行卡 -->
      <div class="countBoxes">
        <div class="countBox">
          <div class="countItem">剧本收益</div>
          <div class="money"><span style="font-size:14px;">￥</span>{{ 114514 }}</div>
        </div>

        <div class="countBox">
          <div class="text">
            <div class="countItem">银行卡</div>
            <div class="money">去绑定</div>
          </div>
          <img src="@/assets/icons/rightArrow.png" alt="" />
        </div>
      </div>
      <!-- 右边的稿费提现按钮 -->
      <button class="cashWithdrawal">稿费提现</button>
    </div>

    <!-- 标题栏 -->
    <div class="scriptTitleBar">
      <div class="leftTitle">存余明细</div>
    </div>

    <!-- 作品收入 -->
    <div class="scriptIncomeMessage">
      <div class="messageTitle">
        <span>作品</span>
        <span>收入 &nbsp;(元)</span>
      </div>
      <div class="scriptBox" v-for="(item, index) in scriptList" :key="index">
        <div class="leftScript">
          <div class="imgBox">
            <img :src="item.thumb" alt="" />
            <!-- <div class="altImg">修改封面</div> -->
          </div>
          <div class="textBox">
            <div class="scriptName">{{ item.book_name }}</div>
            <div class="wordCount">{{ item.word_count }} 字</div>
            <div class="newest">最新剧集: 第{{ item.chapter_count }}集</div>
            <div class="updateTime">更新时间: {{ item.update_time }}</div>
          </div>
        </div>
        <div class="rightFnBtn">
          {{ item.totalcost }}
        </div>
      </div>
    </div>

    <!-- 标题栏 -->
    <div class="scriptTitleBar" style="margin-top: 40px">
      <div class="leftTitle">存余说明</div>
    </div>
    <div class="policy">
      <p>
        1、存余为您暂未满足支付条件的稿酬收入，一旦同一授权方和同一签约主体下的作品稿费累计达到200元，网站将予以支付稿费。<br />
        2、不同授权方主体需各自累计满200元才予以支付，例如您当前作者账号下的作品A授权方为张三，作品B授权方为李四，需要在张三和李四名下的稿费总数各自达到200元，网站方予以支付。<br />
        3、不同签约主体需各自累计满200元才能支付，假设您当前作者账号下的作品A剧好多网，作品B签约中文在线，需要在剧好多网为签约主体的作品，和以中文在线为签约主体的作品累积稿费总数各自达到200元，网站方予以支付。
      </p>
    </div>
  </div>
</template>

<script>
import { myScriptPassed } from "@/requests/author";
import { getYearMonthDay } from "@/utils";

export default {
  data() {
    return {
      scriptList: [],
    };
  },
  mounted() {
    myScriptPassed().then((res) => {
      // console.log(res);
      if (res.status == 200) {
        this.scriptList = res.data.BookList.data;
      }
    });
  },
  computed: {
    // 计算当前的日期
    currentDate() {
      let date = getYearMonthDay(new Date());
      return `${date.year} 年 ${date.month + 1} 月 ${date.day} 日`;
    },
  },
};
</script>

<style lang="less" scoped>
@import url('@/assets/font.less');

.noBorder {
  border-bottom: none !important;
}

.scriptTitleBar {
  width: 1000px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  justify-content: space-between;

  .leftTitle {
    color: #333;
    font-size: 18px;

    .countNumber {
      font-family: robota;
    }
  }

  .rightFn {
    display: flex;
    align-items: center;

    .createNewScript,
    .lookAll {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #9e9e9e;

      span {
        margin-left: 16px;
      }
    }

    .lookAll {
      margin-left: 24px;
    }
  }
}

.income {
  width: 1040px;

  .countTable {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0;

    .countBoxes {
      display: flex;
      .countBox {
        width: 220px;
        height: 96px;
        border-radius: 8px;
        background-color: #f9f9f9;
        margin-right: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 18px 24px;
        box-sizing: border-box;
        cursor: pointer;

        &:last-child {
          .text {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .money {
            font-weight: normal;
          }

          flex-direction: row;
          align-items: center;
        }

        .countItem {
          color: #999999;
          font-size: 14px;
        }

        .money {
          font-size: 18px;
          font-family: robota;
          font-weight: bold;
          color: #333;
        }

        img {
          width: 7px;
          height: 12px;
        }
      }
    }

    .cashWithdrawal {
      width: 96px;
      height: 36px;
      background-color: #fe7d1c;
      border-radius: 200px;
      color:white;
      cursor: pointer;
      font-size: 16px;
    }
  }

  .scriptIncomeMessage {
    margin-bottom: 16px;

    .messageTitle {
      display: flex;
      justify-content: space-between;
      padding: 0 122px 0 33px;
      margin-top: 16px;
      color: #9e9e9e;
      font-size: 18px;
    }

    .scriptBox {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;

      .leftScript {
        display: flex;
        align-items: center;

        .imgBox {
          width: 102px;
          height: 136px;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgb(227, 227, 227);

          img {
            height: 100%;
          }

          .altImg {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 24px;
            font-size: 14px;
            text-align: center;
            line-height: 24px;
            color: white;
            background-color: #0000007f;
            cursor: pointer;
          }
        }

        .textBox {
          margin-left: 16px;
          color: #9e9e9e;
          font-size: 15px;

          .scriptName {
            color: #333;
          }

          .wordCount {
            margin: 8px 0;
          }

          .newest {
            margin-bottom: 8px;
          }
        }
      }

      .rightFnBtn {
        width: 315px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        color: #333;
      }
    }
  }

  .policy {
    margin-top: 16px;

    p {
      color: #666666;
      font-size: 14px;
      line-height: 28px;
    }
  }
}
</style>