import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/dataCenter/list',
    method: 'get',
    params: query
  })
}

export function add(data) {
  return request({
    url: '/dataCenter',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/dataCenter',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/dataCenter/' + id,
    method: 'delete',
  })
}

export function getBase(id) {
  return request({
    url: '/dataCenter/' + id,
    method: 'get'
  })
}
