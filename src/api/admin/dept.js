import request from '@/utils/request'

export function table (queryParams) {
  return request({
    url: '/admin/dept/table',
    method: 'get',
    params: queryParams
  })
}

export function select () {
  return request({
    url: '/admin/dept/select',
    method: 'get'
  })
}
