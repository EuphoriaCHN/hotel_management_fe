import * as React from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Row, Col, Table, Spin, message, Popconfirm, Typography, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setTypes } from '@store/room';
import { ROOM_TYPE, RoomManagementRoomCountMock } from '@common/constants';
import { debounce } from 'lodash-es';

// 引入 ECharts 主模块
import echarts, { EChartsType } from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';
import AddRoomTypeModal from '@components/AddRoomTypeModal/AddRoomTypeModal';

import { QUERY_ALL_ROOM_TYPE, QUERY_ALL_ROOM, ADD_ROOM_TYPE, DELETE_ROOM_TYPE } from '@api';

import './RoomManagement.scss'

export type RoomTypeRes = {
  count: number;
  priceUnit: string;
  roomKey: string;
  roomPrice: number;
  roomType: string;
};

type IProps = {};

const ROOM_TYPE_PAGE_SIZE = 5;

const RoomManagement: React.SFC<IProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const [roomTableCurrent, setRoomTableCurrent] = React.useState<number>(1);
  const [roomTableTotal, setRoomTableTotal] = React.useState<number>(0);
  const [addRoomTypeModalVisible, setAddRoomTypeModalVisible] = React.useState<boolean>(false);
  const [modifiedRoomInstance, setModifiedRoomInstance] = React.useState<RoomTypeRes>(null);

  // 按类型分组，房间数量柱状图
  const roomManagementRoomCountWithTypeGraphRef = React.useRef<EChartsType>(null);

  const { t } = useTranslation();
  const room: any = useSelector((state: any) => state.room);
  const dispatch = useDispatch();

  const handleLoadRoomTypes = React.useCallback(async (blockLoading?: boolean) => {
    roomManagementRoomCountWithTypeGraphRef.current.showLoading();
    setLoading(true);
    try {
      const roomTypeData = await QUERY_ALL_ROOM_TYPE([roomTableCurrent, ROOM_TYPE_PAGE_SIZE]);
      if (!roomTypeData || !roomTypeData.length) {
        dispatch(setTypes({ types: {} }));
        return;
      }
      setRoomTableTotal(roomTypeData[0].count);

      const types = {};
      roomTypeData.forEach((item: RoomTypeRes) => {
        types[item.roomType] = item;
      });
      dispatch(setTypes({ types }));

      // 设置图表
      roomManagementRoomCountWithTypeGraphRef.current.setOption(
        RoomManagementRoomCountMock.echartsOptions.roomManagementRoomCountWithType(Object.keys(types) as any)
      );
      roomManagementRoomCountWithTypeGraphRef.current.resize();
    } catch (error) {
      message.error(error.message || JSON.stringify(error));
      message.error(t('加载客房类型失败'));
    } finally {
      !blockLoading && setLoading(false);
      roomManagementRoomCountWithTypeGraphRef.current.hideLoading();
    }
  }, [roomTableCurrent]);

  const handleAddRoomType = React.useCallback(async (type: keyof typeof ROOM_TYPE, price: number) => {
    if (room.types[type]) {
      // 类型已经被添加过了
      message.warn(ROOM_TYPE[type].concat(t('已存在')));
      return;
    }
    setLoading(true);
    try {
      await ADD_ROOM_TYPE({
        data: {
          roomKey: type,
          roomType: type,
          roomPrice: price
        }
      });
      setAddRoomTypeModalVisible(false);
      message.success(t('客房类型已创建'));
      handleLoadRoomTypes();
    } catch (error) {
      message.error(t('创建类型失败'));
      message.error(error.message || JSON.stringify(error));
      setLoading(false);
    }
  }, [room]);

  const handleDeleteRoomType = React.useCallback(async (record: RoomTypeRes) => {
    setLoading(true);
    try {
      await DELETE_ROOM_TYPE({
        data: {
          roomKey: record.roomKey
        }
      });
      message.success(t('类型已删除'));
      handleLoadRoomTypes();
    } catch (error) {
      message.error(t('删除类型失败'));
      message.error(error.message || JSON.stringify(error));
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    roomManagementRoomCountWithTypeGraphRef.current = echarts
      .init(document.getElementById('roomManagementRoomCountWithTypeGraph'));

    roomManagementRoomCountWithTypeGraphRef.current.setOption(
      RoomManagementRoomCountMock.echartsOptions.roomManagementRoomCountWithType(['KING_SIZE'])
    );

    handleLoadRoomTypes();

    const handleWindowResize = debounce((ev: UIEvent) => {
      roomManagementRoomCountWithTypeGraphRef.current.resize();
    }, 500);

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const roomTypeTableColumns = React.useMemo(() => ([{
    title: t('房间类型'),
    key: 'name',
    render: (_, record: RoomTypeRes) => <span>{ROOM_TYPE[record.roomType] || t('未知类型')}</span>
  }, {
    title: t('价格'),
    key: 'account',
    render: (_, record: RoomTypeRes) => <span>{record.roomPrice} {record.priceUnit}</span>
  }, {
    title: t('操作'),
    key: 'operation',
    render: (_, record: RoomTypeRes) => (
      <Space size={'middle'}>
        <Typography.Link
          onClick={() => {
            setModifiedRoomInstance(record);
            setAddRoomTypeModalVisible(true);
          }}
        >
          {t('修改价格')}
        </Typography.Link>
        <Popconfirm
          title={t('确认要删除此分类？删除后数据不可恢复')}
          onConfirm={handleDeleteRoomType.bind(this, record)}
          okText={t('删除')}
          cancelText={t('取消')}
          okType={'danger'}
        >
          <Typography.Link>{t('删除')}</Typography.Link>
        </Popconfirm>
      </Space>
    )
  }]), []);

  const rows = [[[(
    <React.Fragment>
      <div className={'room-management-operations'}>
        <Button
          type={'primary'}
          onClick={() => {
            setModifiedRoomInstance(null);
            setAddRoomTypeModalVisible(true);
          }}
        >
          {t('添加房间类型')}
        </Button>
      </div>
      <Table
        columns={roomTypeTableColumns}
        dataSource={Object.values(room.types) as any}
        pagination={{
          current: roomTableCurrent,
          pageSize: ROOM_TYPE_PAGE_SIZE,
          total: roomTableTotal,
          onChange: page => {
            setRoomTableCurrent(page);
          },
          hideOnSinglePage: true
        }}
        bordered
      />
    </React.Fragment>
  )], [
    <div id={'roomManagementRoomCountWithTypeGraph'} className={'echarts-graph'} />
  ]]];

  return (
    <React.Fragment>
      <div className={'container room-management'}>
        <Spin spinning={loading}>
          <ContainerHeader text={t('客房管理')} />
          {rows.map(row => {
            if (!row.length) return null;
            return (
              <Row gutter={24}>
                {row.map(col => {
                  if (!col.length) return null;
                  return (
                    <Col span={12}>
                      <div className={'room-management-col-item'}>{col}</div>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Spin>
      </div>
      <AddRoomTypeModal
        visible={addRoomTypeModalVisible}
        loading={loading}
        onCancel={() => {
          setModifiedRoomInstance(null);
          setAddRoomTypeModalVisible(false);
        }}
        onOk={handleAddRoomType}
        modifiedInstance={modifiedRoomInstance}
      />
    </React.Fragment>
  );
};

export default RoomManagement;