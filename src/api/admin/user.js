import request, { download } from '@/utils/request'

export function page (queryParams) {
  return request({
    url: '/admin/users',
    method: 'get',
    params: queryParams
  })
}

export function detail (id) {
  return request({
    url: '/admin/users/' + id,
    method: 'get'
  })
}

export function add (data) {
  return request({
    url: '/admin/users',
    method: 'post',
    data: data
  })
}

export function update (id, data) {
  return request({
    url: '/admin/users/' + id,
    method: 'put',
    data: data
  })
}

export function patch (id, data) {
  return request({
    url: '/admin/users/' + id,
    method: 'patch',
    data: data
  })
}

export function del (ids) {
  return request({
    url: '/admin/users/' + ids,
    method: 'delete'
  })
}

export function getUserInfo () {
  return request({
    url: '/admin/users/me',
    method: 'get'
  })
}

export const excelImport = process.env.VUE_APP_BASE_API + '/admin/users/excelImport'

export function excelExport (filename, queryParams = { pageNum: 0 }) {
  download('/admin/users/excelExport', queryParams, filename)
}
