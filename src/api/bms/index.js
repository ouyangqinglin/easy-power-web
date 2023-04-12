import request from '@/utils/request'

// 查询告警信息列表
export function getList(query) {
  return request({
    url: '/faultRecord/list',
    method: 'get',
    params: query
  })
}