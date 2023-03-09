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

