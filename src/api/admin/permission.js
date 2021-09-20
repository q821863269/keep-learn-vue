import request from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/permissions',
    method: 'get',
    params: queryParams
  })
}

export function list (queryParams) {
  return request({
    url: '/admin/permissions/list',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/permissions/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/permissions',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/permissions/' + id,
    method: 'put',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/permissions/' + ids,
    method: 'delete'
  })
}
