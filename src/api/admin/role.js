import request from '@/utils/request'

export function list () {
  return request({
    url: '/admin/role/list',
    method: 'get'
  })
}
