import request from '@/utils/request'

export function route () {
  return request({
    url: '/admin/menus/route',
    method: 'get'
  })
}
