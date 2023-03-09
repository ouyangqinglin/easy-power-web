import request from '@/utils/request'
// 查询用户详细
export function getAgencyList(params) {
  return request({
    url: '/agency/list',
    method: 'get',
    params
  })
}

// 删除用户
export function delAtiAgency(id) {
  return request({
    url: '/agency/' + id,
    method: 'delete'
  })
}

// 新增用户
export function addAgency(data) {
  return request({
    url: '/agency',
    method: 'post',
    data: data
  })
}

  // 修改用户
  export function modifyAgency(data) {
    return request({
      url: '/agency',
      method: 'put',
      data: data
    })
}
