import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic YWRtaW46MTIzNDU2'
    }
  })
}

export function getUserInfo () {
  return request({
    url: '/admin/users/me',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/auth/oauth/logout',
    method: 'delete'
  })
}
