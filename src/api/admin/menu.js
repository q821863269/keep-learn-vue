import request from '@/utils/request'

export function getMenuRouteList () {
  return request({
    url: '/admin/menu/route',
    method: 'get'
  })
}
