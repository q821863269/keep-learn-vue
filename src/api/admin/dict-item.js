import request from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/dictItems',
    method: 'get',
    params: queryParams
  })
}

export function list () {
  return request({
    url: '/admin/dictItems/list',
    method: 'get'
  })
}

export function detail (id) {
  return request({
    url: '/admin/dictItems/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/dictItems',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/dictItems/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/dictItems/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/dictItems/' + ids,
    method: 'delete'
  })
}
