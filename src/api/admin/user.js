import request from '@/utils/request'

export function getUserInfo () {
  return request({
    url: '/admin/users/me',
    method: 'get'
  })
}
