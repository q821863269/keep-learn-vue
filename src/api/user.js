import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/youlai-auth/oauth/token',
    method: 'post',
    params: data,
    headers: {
      'Authorization': 'Basic eW91bGFpLWFkbWluOjEyMzQ1Ng=='
    }
  })
}

export function getUserInfo () {
  return request({
    url: '/youlai-admin/api/v1/users/me',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/youlai-auth/oauth/logout',
    method: 'delete'
  })
}
