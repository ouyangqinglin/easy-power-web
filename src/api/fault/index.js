import request from "@/utils/request";

// 统计故障总数
export function getTotalNum() {
  return request({
    url: '/faultRecord/count',
    method: 'get',
  })
}

// 故障排名
export function alarmRank(params) {
  return request({
    url: '/faultRecord/alarmRanking',
    method: 'get',
    params
  })
}

// 站点故障排名
export function siteAlarmRank(params) {
  return request({
    url: '/faultRecord/siteAlarmRanking',
    method: 'get',
    params
  })
}

// 故障饼图
export function pileNum(params) {
  return request({
    url: '/faultRecord/pieNum',
    method: 'get',
    params
  })
}

// statistics统计图
export function statisticsNum(params) {
  return request({
    url: '/faultRecord/statistics',
    method: 'get',
    params
  })
}
