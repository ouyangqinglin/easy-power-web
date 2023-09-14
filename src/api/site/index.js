import request from '@/utils/request'

// 查询站点列表
export function listSite(query) {
  return request({
    url: '/site/list',
    method: 'get',
    params: query
  })
}
// 省市区查询
export function getAddress(params) {
  return request({
    url: '/site/areaList',
    method: 'get',
    params
  })
}

// 查询站点详细
export function getSite(params) {
  return request({
    url: '/site/' + params.id,
    method: 'get'
  })
}

// 新增站点
export function addSite(data) {
  return request({
    url: '/site',
    method: 'post',
    data: data
  })
}

// 修改站点
export function updateSite(data) {
  return request({
    url: '/site',
    method: 'put',
    data: data
  })
}

// 删除站点
export function delSite(id) {
  return request({
    url: '/site/' + id,
    method: 'delete'
  })
}

// 站点其他设置列表
export function siteSetting(params) {
  return request({
    url: '/timeSet/list',
    method: 'get',
    params
  })
}

// 站点其他设置更改
export function siteSettingSubmit(data) {
  return request({
    url: '/timeSet/batchUpdate',
    method: 'post',
    data
  })
}

// 报警列表
export function alarmList(params) {
  return request({
    url: '/faultRecord/list',
    method: 'get',
    params,
  })
}

export function editAlarm(data) {
  return request({
    url: '/faultRecord',
    method: 'put',
    data,
  })
}

// 错误列表
export function warnList(params) {
  return request({
    url: '/faultRecord/deviceFaultList',
    method: 'get',
    params,
  })
}

// 时区列表
export function timeZoneList(params) {
  return request({
    url: '/zone/list',
    method: 'get',
    params,
  })
}
