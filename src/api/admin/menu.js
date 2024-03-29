import request from '@/utils/request'

export function route () {
  return request({
    url: '/admin/menus/route',
    method: 'get'
  })
}

export function select (queryParams) {
  return request({
    url: '/admin/menus/select',
    method: 'get',
    params: queryParams
  })
}

export function table (queryParams) {
  return request({
    url: '/admin/menus/table',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/menus/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/menus',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/menus/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/menus/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/menus/' + ids,
    method: 'delete'
  })
}
