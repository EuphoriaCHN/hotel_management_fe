// 常量池
import I18n from '../../i18n';

const echarts = require('echarts');

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

export const ROOM_TYPE = {
  KING_SIZE: I18n.t('大床房'),
  SINGLE: I18n.t('单人房'),
  TWIN: I18n.t('双床房'),
  SUPERIOR_FAMILY: I18n.t('高级家庭房'),
  SUITE: I18n.t('套房')
} as const;

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


// MOCK DATA
const roomManagementRoomCountMockData = {
  KING_SIZE: 48,
  SINGLE: 56,
  TWIN: 21,
  SUPERIOR_FAMILY: 30,
  SUITE: 15
};

export const RoomManagementRoomCountMock = {
  data: roomManagementRoomCountMockData,

  echartsOptions: {
    roomManagementRoomCountWithType: (types: Array<keyof typeof ROOM_TYPE> = []): any => {
      const data = types.map(type => roomManagementRoomCountMockData[type]);
      const dataValueMax = Math.max(...data) + 10;
      const dataShadow = new Array(types.length).fill(dataValueMax);

      return {
        title: {
          text: I18n.t('客房数量分布图'),
          // subtext: I18n.t('点击柱状图或缩放可交互')
        },
        xAxis: {
          data: types.map(type => ROOM_TYPE[type]),
          axisLabel: {
            // inside: true,
            // textStyle: {
            //     color: '#fff'
            // }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ]
                )
              }
            },
            data
          }
        ]
      };
    }
  }
};