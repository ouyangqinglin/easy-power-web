import request from '@/utils/request'

// 列表
export function listDevice(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}
// 详情
export function infoDevice(query) {
  return request({
    url: '/device/info',
    method: 'get',
    params: query
  })
}

// 批量添加设备
export function addBatchDevice(query) {
  return request({
    url: '/device/batchAdd',
    method: 'post',
    data: query
  })
}

// 设置设备
export function setDevice(query) {
  return request({
    url: '/device/setting',
    method: 'post',
    data: query
  })
}

// 删除设备
export function delDevice(id) {
  return request({
    url: `/device/${id}`,
    method: 'delete',
  })
}

// 设备详情
export function baseDevice(id) {
  return request({
    url: `/device/${id}`,
    method: 'get',
  })
}

// 停止充电
export function stopCharge(data) {
  return request({
    url: `/device/stop/`,
    method: 'post',
    data
  })
}

export function setRecodeList(params) {
  return request({
    url: `/siteSettingRecord/list`,
    method: 'get',
    params
  })
}
export function getSettingInfo(params) {
  return request({
    url: `/device/settingInfo`,
    method: 'get',
    params
  })
}

export function deviceSet(data) {
  return request({
    url: `/device/setting`,
    method: 'post',
    data
  })
}

export function batHistoryData(params) {
  return request({
    url: `/device/dataBatteryInfoStatistics`,
    method: 'get',
    params
  })
}

export function pvHistoryData(params) {
  return request({
    url: `/device/dataPVInfoStatistics`,
    method: 'get',
    params
  })
}

export function cellData(params) {
  return request({
    url: `/device/dataCellInfoStatistics`,
    method: 'get',
    params
  })
}

export function netList(params) {
  return request({
    url: `/device/netList`,
    method: 'get',
    params
  })
}

export function editDevice(data) {
  return request({
    url: `/device`,
    method: 'put',
    data
  })
}
