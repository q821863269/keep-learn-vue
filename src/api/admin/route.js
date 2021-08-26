import request from '@/utils/request'

export function list (queryParams) {
  return request({
    url: '/admin/routes',
    method: 'get',
    params: queryParams
  })
}
