import request from '@/utils/request'

export function list () {
  return request({
    url: '/admin/roles/list',
    method: 'get'
  })
}
