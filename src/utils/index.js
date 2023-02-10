// 获取年月日
const getYearMonthDay = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return { year, month, day };
}


const getDate = (year, month, day) => {
  return new Date(year, month, day);
}


// 身份证验证函数
/* 根据方案1的不足，引入方案2进而改进方案1的不足。

根据上述地址码做身份证号码的前两位校验，进一步的提高准确率。
当前的地址码以2013版的行政区划代码【GB/T2260】为标准。由于区划代码的历史演变，
使得地址码后四位校验变得不太可能。以三胖的身份证号为例，本人号码是2321开头，
而当前行政区划代码表中并无此代码。因此本文只做前两位省级地址码的校验。

根据以上分析，给出省级地址码校验及测试程序如下： */
var checkProv = function (val) {
  var pattern = /^[1-9][0-9]/;
  var provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}


// 2.2 出生日期码校验
// 出生日期码的校验不做解释，直接给出如下函数及测试程序：
var checkDate = function (val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true;
    }
  }
  return false;
}


// 校验码校验
var checkCode = function (val) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  var code = val.substring(17);
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
}

// 调用验证
var checkID = function (val) {
  if (checkCode(val)) {
    var date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
}


// 银行卡验证
var bankCardIdTest = function (data) {
  var regExp = /^([1-9]{1})(\d{15}|\d{18})$/;
  return regExp.test(data)
}

// 手机号正则验证
var telTest = function (tel) {
  var phoneReg = /(^1\d{10}$)|(^[0-9]\d{7}$)/;
  return phoneReg.test(tel)
}


// 导出方法
export { getYearMonthDay, getDate, checkID, bankCardIdTest, telTest }
