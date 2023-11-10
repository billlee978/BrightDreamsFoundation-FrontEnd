import request from '@/utils/request'

const api_name = '/good'

export default {

  /*
  获取good分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  },
  releaseGood(id) {
    return request({
      url: `${api_name}/releaseGood/${id}`,
      method: 'post'
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  save(good) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: good
    })
  }
}
