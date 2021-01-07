// 常量池
import I18n from '../../i18n';

// 证件类型
export const IdentityType = {
  ID: I18n.t('身份证'),
  DRIVER_LICENSE: I18n.t('驾驶证'),
  CERTIFICATE: I18n.t('军官证')
}

export const USER_TYPE = {
  normal: I18n.t('普通用户'),
  admin: I18n.t('管理员')
}

// 正则匹配
export const REGEXP = {
  name: /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/,
  phone: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
  id: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  driver: /^[1-8]\d{11}$/,
  certificate: /^[南北沈兰成济广参证后装海空]\d{6,8}$/
};

export const STATUS = {
  OK: 'OK',
  ERROR: 'ERROR',
  LOGIN_ERROR: 'LOGIN_ERROR',
  ACCESS_ERROR: 'ACCESS_ERROR',
  REMOTE_ERROR: 'REMOTE_ERROR',
  REP_ERROR: 'REP_ERROR',
  PARAM_ERROR: 'PARAM_ERROR',
  EXPIRED_ERROR: 'EXPIRED_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CAN_NOT_DELETE: 'CAN_NOT_DELETE',
  NO_SUCH_KEY: 'NO_SUCH_KEY',
  KEY_EXIST: 'KEY_EXIST',
  INNER_ERROR: 'INNER_ERROR'
};

export const STATUS_TEXT = {
  OK: I18n.t('成功'),
  ERROR: I18n.t('失败'),
  LOGIN_ERROR: I18n.t('用户名或密码错误'),
  ACCESS_ERROR: I18n.t('权限不足'),
  REMOTE_ERROR: I18n.t('远程调用失败'),
  REP_ERROR: I18n.t('重复操作'),
  PARAM_ERROR: I18n.t('参数错误'),
  EXPIRED_ERROR: I18n.t('权限过期'),
  USER_NOT_FOUND: I18n.t('用户不存在'),
  CAN_NOT_DELETE: I18n.t('无法删除'),
  NO_SUCH_KEY: I18n.t('不存在此 Key'),
  KEY_EXIST: I18n.t('Key 已存在'),
  INNER_ERROR: I18n.t('糟糕...服务器打瞌睡了...'),
};