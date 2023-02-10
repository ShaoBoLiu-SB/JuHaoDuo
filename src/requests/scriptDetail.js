import baserequest from "./baserequest";

let userToken = localStorage.getItem('userToken')

// 点击书籍,根据book_id获取书籍详情
export const reqBookDetail = (book_id, token) => {
  if (token) {
    return baserequest({
      url: `/BookList/BookInfo?book_id=${book_id}&token=${token}`,
    })
  } else {
    return baserequest({
      url: `/BookList/BookInfo?book_id=${book_id}`,
    })
  }
}

// 客服微信二维码
export const serveQRCode = () => {
  return baserequest({
    url: `/BookList/weixinurl`,
    method: 'GET'
  })
}

// 根据点击的章节范围, 获取章节序列
export const getScriptList = (book_id, page = 1) => {
  return baserequest({
    url: `/BookList/chapterList?book_id=${book_id}&page=${page}`
  })
}

// 根据当前剧本详情的book_id 来收藏这个剧本
export const collectBook = (book_id, userToken) => {
  return baserequest({
    url: `/BookList/Bookshelf?book_id=${book_id}&token=${userToken}`,
  })
}

// 书籍内容
export const chapterDetail = (book_id, chapter_id) => {
  return baserequest({
    url: `/BookList/chapterInfo?book_id=${book_id}&chapter_id=${chapter_id}&token=${userToken}`
  })
}


