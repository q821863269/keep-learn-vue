import request from '@/utils/request'

export function select (queryParams) {
  return request({
    url: '/admin/depts/select',
    method: 'get',
    params: queryParams
  })
}

export function table (queryParams) {
  return request({
    url: '/admin/depts/table',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/depts/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/depts',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/depts/' + id,
    method: 'put',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/depts/' + ids,
    method: 'delete'
  })
}
