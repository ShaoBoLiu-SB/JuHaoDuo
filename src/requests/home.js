import baserequest from "./baserequest";

// home页面的推荐
export const reqIndexRecommend = () => {
  return baserequest({
    url: '/Index/IndexRecommed',
    method: 'GET'
  })
}

// 获取最近更新的网络请求
export const reqRecentUpdate = () => {
  return baserequest({
    url:'/Index/IndexRecently?page=2',
    method:'GET'
  })
}