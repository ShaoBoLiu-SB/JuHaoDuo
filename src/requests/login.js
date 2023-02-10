import baserequest from "./baserequest";

// 获取验证码的网络请求
export const getCheckCode = (userTel) => {
  return baserequest({
    url: `/login/getMobileCode?phone=${userTel}`,
    method: 'GET'
  })
}


// 携带验证码进行登录
export const checkCodeLogin = (userTel, checkCode) => {
  return baserequest({
    url: `/login/mobileLogin?phone=${userTel}&code=${checkCode}`,
    method: 'GET'
  })
}


// 密码登录
export const pwdLogin = (username, password) => {
  return baserequest({
    url: `/login/index?username=${username}&password=${password}`,
    method: 'POST',
    username,
    password
  })
}


// 二维码登录
export const qrCodeLogin = () => {
  return baserequest({
    url: `/login/weixinqr`
  })
}


// 微信扫码核验登录
export const qrcodeLoginCheck = (state) => {
  return baserequest({
    url:`/login/checkwxlogin?state=${state}`
  })
}


export const getqrCode = () => {
  return baserequest({
    url:`/login/weixinqr`
  })
}