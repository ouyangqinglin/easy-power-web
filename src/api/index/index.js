import request from '@/utils/request'

// 首页单项数据统计
export function homeInfo() {
  return request({
    url: '/site/production',
    method: 'get',
  })
}

// 首页发电报表统计
export function homeChart(params) {
  return request({
    url: '/site/statistics',
    method: 'get',
    params,
  })
}

// 首页发电排行
export function rankChart(params) {
  return request({
    url: '/site/rankList',
    method: 'get',
    params,
  })
}

export function getWeather(params) {
  return request({
    url: `/weather/getWeather`,
    method: 'get',
    params
  })
}
export function getNet(params) {
  return request({
    url: `/device/getNet`,
    method: 'get',
    params
  })
}
