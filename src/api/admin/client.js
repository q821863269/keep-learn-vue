import request from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/oauthClients',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/oauthClients/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/oauthClients',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/oauthClients/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/oauthClients/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/oauthClients/' + ids,
    method: 'delete'
  })
}
