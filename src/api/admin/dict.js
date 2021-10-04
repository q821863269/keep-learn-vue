import request from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/dicts',
    method: 'get',
    params: queryParams
  })
}

export function list () {
  return request({
    url: '/admin/dicts/list',
    method: 'get'
  })
}

export function detail (id) {
  return request({
    url: '/admin/dicts/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/dicts',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/dicts/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/dicts/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/dicts/' + ids,
    method: 'delete'
  })
}
