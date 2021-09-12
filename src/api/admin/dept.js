import request from '@/utils/request'

export function table (queryParams) {
  return request({
    url: '/admin/depts/table',
    method: 'get',
    params: queryParams
  })
}

export function select () {
  return request({
    url: '/admin/depts/select',
    method: 'get'
  })
}
