import baserequest from "./baserequest";

let userToken = localStorage.getItem('userToken')

// 我的收藏
export const myCollection = () => {
  return baserequest({
    url: `/BookList/MyBookshelf?token=${userToken}`,
    method: 'GET'
  })
}

// 最近浏览
export const recentRead = (page = 1) => {
  return baserequest({
    url: `/bookList/readlog?token=${userToken}&page=${page}`,
    method: "GET"
  })
}

// 修改头像
export const altAvatar = () => {
  return baserequest({
    url: `/user/reviseheadimg?token=${userToken}`,
    method: 'POST'
  })
}

// 我的剧本（通过审核）
export const myScript = () => {
  return baserequest({
    // url: `/writer/dramaList?token=${userToken}&page=${page}`
    url: `/User/myDrama?token=${userToken}`
  })
}

// 设置密码
export const setPws = (data) => {
  return baserequest({
    url: `/login/reg`,
    method: 'POST',
    data
  })
}

// 修改密码
export const altPwd = (data) => {
  return baserequest({
    url: `/user/revisepassword?token=${userToken}`,
    method: 'POST',
    data
  })
}

// 修改手机号的两个接口
// 先验证密码
export const checkPwd = (password) => {
  return baserequest({
    url: `/user/checkpassword?token=${userToken}&password=${password}`,
  })
}

// 然后再更改手机号
export const altPhone = (data) => {
  return baserequest({
    url: `/user/revisemobile?token=${userToken}&phone=${data.phone}`,
    method: 'POST',
    data
  })
}


// 交易记录
export const transaction = (page) => {
  return baserequest({
    url: `/User/saleList?token=${userToken}&page=${page}`
  })
}


// 修改基本资料的接口
export const changeUserData = (userName, userMail) => {
  return baserequest({
    url: `/user/reviseinfo?token=${userToken}&username=${userName}&email=${userMail}`
  })
}