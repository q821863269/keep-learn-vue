import request from '@/utils/request'

export function getMenuRouteList () {
  return request({
    url: '/admin/menus/route',
    method: 'get'
  })
}
