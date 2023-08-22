import request from '@/utils/request'
import {getToken} from "@/utils/auth";

export function uploadFile(data) {
  return request({
    url: '/version/addAppendix',
    method: 'post',
    data
  })
}

export function versionList(params) {
  return request({
    url: '/version/list',
    method: 'get',
    params
  })
}

export function versionRecord(params) {
  return request({
    url: '/UpgradeRecord/list',
    method: 'get',
    params
  })
}

export function versionNew(params) {
  return request({
    url: `/version/list/limit/version`,
    method: 'get',
    params
  })
}

export function versionUpgrade(data) {
  return request({
    url: `/device/upgrade`,
    method: 'post',
    data
  })
}

export function versionDetails(id) {
  return request({
    url: '/version/' + id,
    method: 'get'
  })
}

export function upgradeTaskList(params) {
  return request({
    url: '/upgradeTask/list',
    method: 'get',
    params
  })
}

export function upgradeTaskRecord(params) {
  return request({
    url: '/UpgradeRecord/list',
    method: 'get',
    params
  })
}

export function upgradeTaskExport(data) {
  return request({
    url: '/upgradeTask/export',
    method: 'post',
    data
  })
}

export function upgradeNum(params) {
  return request({
    url: '/upgradeTask/num',
    method: 'get',
    params
  })
}

export function againUpgrade(data) {
  return request({
    url: '/upgradeTask/againUpgrade',
    method: 'post',
    data
  })
}
export function addUpgradeTask(data) {
  return request({
    url: '/upgradeTask',
    method: 'post',
    data
  })
}

