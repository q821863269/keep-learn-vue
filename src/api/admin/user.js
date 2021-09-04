import request from '@/utils/request'

export function getUserInfo () {
  return request({
    url: '/admin/user/me',
    method: 'get'
  })
}

export function list (queryParams) {
  return request({
    url: '/admin/user',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/user/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/user/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/user/' + ids,
    method: 'delete'
  })
}
