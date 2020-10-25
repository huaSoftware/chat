import request from '@/utils/request'

/* 获取日志列表 */
export function logList(data) {
  return request({
    url: '/api/v2/admin/log/list',
    method: 'post',
    data
  })
}
