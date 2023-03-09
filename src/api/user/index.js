import request from '@/utils/request'

// 查询用户列表
export function listAtiUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getAtiUser(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

// 新增用户
export function addAtiUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateAtiUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delAtiUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

// 获取联系人aboutus
export function getContact(params) {
  return request({
    url: '/concat/list',
    method: 'get',
    params
  })
}

// 修改联系人aboutus
export function editContact(data) {
  return request({
    url: '/concat',
    method: 'put',
    data
  })
}

// 根据站点查询关联用户
export function getReCustomer(params) {
  return request({
    url: '/user/userListBySiteCode',
    method: 'get',
    params
  })
}
