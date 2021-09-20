import { login, logout } from '@/api/auth/oauth'
import { getUserInfo } from '@/api/admin/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  introduction: '',
  nickname: '',
  avatar: '',
  email: '',
  roles: [],
  perms: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username,
        password: password,
        grant_type: 'password'
      }).then(response => {
        const {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: tokenType
        } = response.data
        const token = tokenType + ' ' + accessToken
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  refreshToken ({ commit }, refreshToken) {
    commit('SET_TOKEN', undefined)
    return new Promise((resolve, reject) => {
      login({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }).then(response => {
        const {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: tokenType
        } = response.data
        const token = tokenType + ' ' + accessToken
        commit('SET_TOKEN', token)
        setToken(token)
        setRefreshToken(refreshToken)
        resolve(token)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getUserInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject(new Error('Verification failed, please Login again.'))
        }

        const { nickname, avatar, email, roles, perms } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject(new Error('getUserInfo: roles must be a non-null array!'))
        }
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_EMAIL', email)
        commit('SET_ROLES', roles)
        commit('SET_PERMS', perms)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        removeRefreshToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/hxrui/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMS', [])
      removeToken()
      removeRefreshToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles ({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getUserInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
