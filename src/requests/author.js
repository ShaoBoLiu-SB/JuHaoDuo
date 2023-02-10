import baserequest from "./baserequest";

let userToken = localStorage.getItem('userToken')


// 创作中心
export const createCenter = () => {
  return baserequest({
    url: `/writer/wirterinfo?token=${userToken}`,
    method: 'GET'
  })
}

// 提交作者注册信息
export const authorMsgSubmit = (params) => {
  return baserequest({
    url: `/writer/login`,
    params,
    method: 'POST'
  })
}

// 获取创作日历的数据
export const createCalendar = (time) => {
  return baserequest({
    url: `/writer/calendar?token=${userToken}&time=${time}`,
  })
}

// 创建新剧本
export const createNewScript = (data) => {
  return baserequest({
    url: `/writer/createDrama?token=${userToken}`,
    data,
    method: 'post'
  })
}


// 签到打卡
export const qiandao = () => {
  return baserequest({
    url: `/writer/calendarSign?token=${userToken}`
  })
}

// 我的剧本(审核状态不确定)
export const myScriptPassed = (page = 1) => {
  return baserequest({
    url: `http://dj.huashengbook.cn/api/writer/dramaList?token=${userToken}&page=${page}`
  })
}

// 剧集管理-列表
export const chapter_control_list = (bookid, page = 1) => {
  return baserequest({
    url: `/writer/chapterList?token=${userToken}&page=${page}&bookid=${bookid}`
  })
}

//查看剧本内容, 进入编辑器修改
export const editScript = (bookid, chapter_id = 1) => {
  return baserequest({
    url: `/writer/chapterInfo?token=${userToken}&bookid=${bookid}&chapter_id=${chapter_id}`
    // url: `/writer/chapterInfo?token=16693692192yf35nFhmV&bookid=5146&chapter_id=291659`
  })
}

// 章节修改
export const altChapter = (data) => {
  return baserequest({
    url: `/writer/chapterInfo?token=${userToken}`,
    method: 'POST',
    data
  })
}

// 新建章节
export const createChapter = (data) => {
  return baserequest({
    url: `/writer/createchpter?token=${userToken}`,
    method: 'POST',
    data
  })
}