import request from '@/utils/request'

// 列表
export function listTask(params) {
  return request({
    url: '/task/list',
    method: 'get',
    params,
  })
}

// 新增任务
export function createTask(data) {
  return request({
    url: '/task',
    method: 'post',
    data
  })
}

// 修改任务
export function modifyTask(data) {
  return request({
    url: '/task',
    method: 'put',
    data
  })
}

// 任务详细
export function getTaskInfo(id) {
  return request({
    url: '/task/' + id,
    method: 'get',
  })
}

// 手动结束报修
export function finishClosed(data) {
  return request({
    url: '/task/close',
    method: 'post',
    data,
  })
}

// 删除任务
export function delTask(id) {
  return request({
    url: '/task/' + id,
    method: 'delete'
  })
}
