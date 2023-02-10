import baserequest from './baserequest'



// 获取分类列表(按钮选项)
export const reqSortList = () => {
  return baserequest({
    url: '/BookList/SortList',
    method: 'GET'
  })
}


// 根据分类获取剧本
export const getCateScript = (sort_id, role_num, scene_id, order, page) => {
  return baserequest({
    url: `/BookList/BookList?sort_id=${sort_id}&role_num=${role_num}&scene_id=${scene_id}&order=${order}&page=${page}`,
    method: 'GET',
  })
}