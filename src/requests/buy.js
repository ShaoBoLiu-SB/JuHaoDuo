import baserequest from "./baserequest";

let userToken = localStorage.getItem('userToken')

// 购买书籍
export const buyBook = (price, book_id) => {
  return baserequest({
    url: `/Pay/pay?price=${price}&token=${userToken}&book_id=${book_id}`
  })
}

// 验证购买状态结果
export const buyState = (trad_num) => {
  return baserequest({
    url: `/Pay/checkorder?out_trade_no=${trad_num}&token=${userToken}`
  })
}