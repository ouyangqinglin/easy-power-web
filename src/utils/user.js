
export function getUserType() {
  return window.localStorage.getItem('userType')
}

export function setUserType(v) {
  return window.localStorage.setItem('userType', v)
}

export function getChangePassword() {
  return window.localStorage.getItem('changePassword')
}

export function setChangePassword(v) {
  return window.localStorage.setItem('changePassword', v)
}

export function getAgencyName(v) {
  return window.localStorage.getItem('agencyName')
}
export function setAgencyName(v) {
  return window.localStorage.setItem('agencyName', v)
}
export function getAgencyId(v) {
  return window.localStorage.getItem('agencyId')
}
export function setAgencyId(v) {
  return window.localStorage.setItem('agencyId', v)
}

export function getUserId(v) {
  return window.localStorage.getItem('userId')
}
export function setUserId(v) {
  return window.localStorage.setItem('userId', v)
}

export function getTimeZone(v) {
  return window.localStorage.getItem('timeZone')
}
export function setTimeZone(v) {
  return window.localStorage.setItem('timeZone', v)
}

export function getUtc(v) {
  return window.localStorage.getItem('utc')
}
export function setUtc(v) {
  return window.localStorage.setItem('utc', v)
}
