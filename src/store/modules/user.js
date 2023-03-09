import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {getUserType, setUserType, getChangePassword, setChangePassword, getAgencyName, setAgencyName, getAgencyId, setAgencyId, getUserId, setUserId} from '@/utils/user'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    email: '',
    phone: '',
    roles: [],
    agencyId: getAgencyId(),
    userId: getUserId(),
    permissions: [],
    userType: getUserType(),
    agency: getAgencyName(),
    changePassword: getChangePassword()
  },

  mutations: {
    SET_CHANGE: (state, changePassword) => {
      state.changePassword = changePassword
    },
    SET_USER_TYPE: (state, userType) => {
      state.userType = userType
    },
    SET_AGENCY: (state, agency) => {
      state.agency = agency
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_AGENCY_ID: (state, id) => {
      state.agencyId = id
    },
    SET_USER_ID: (state, id) => {
      state.userId = id
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          setUserType(res.userType)
          commit('SET_USER_TYPE', res.userType)
          commit('SET_CHANGE', res.changePassword)
          setChangePassword(res.changePassword)
          commit('SET_AGENCY', res.agency)
          setAgencyName(res.agency)
          commit('SET_AGENCY_ID', res.agencyId)
          setAgencyId(res.agencyId)
          commit('SET_USER_ID', res.userId)
          setUserId(res.userId)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          const avatar = (user.avatar === "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_AVATAR', avatar)
          commit('SET_EMAIL', user.email)
          commit('SET_PHONE', user.phonenumber)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
