import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { USER_TYPE } from '@common/constants';
import { debounce } from 'lodash-es';

import { message, Table, Space, Typography, Badge, Input, Popconfirm, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import {
  QUERY_ALL_USER,
  ADMIN_MODIFY_NORMAL,
  ADMIN_DELETE_NORMAL,
  ADMIN_QUERY_SOME_USER,
  ADMIN_CREATE_NORMAL
} from '@api';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';
import ModifyUserModal from '@components/ModifyUserModal/ModifyUserModal';
import AddUserModal from '@components/AddUserModal/AddUserModal';

import './Users.scss';

const DEFAULT_CURRENT = 1;
const DEFAULT_PAGE_SIZE = 10;

export type UserTable = {
  key: string;
  name: string;
  account: string;
  type: keyof typeof USER_TYPE;
};

type IProps = {};

function Users(props: IProps) {
  const [current, setCurrent] = React.useState<number>(DEFAULT_CURRENT);
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = React.useState<number>(0);
  const [tableData, setTableData] = React.useState<UserTable[]>([]);
  const [searchedValue, setSearchedValue] = React.useState<string>('');

  const [modifiedUserModalVisible, setModifiedUserModalVisible] = React.useState<boolean>(false);
  const [modifiedUser, setModifiedUser] = React.useState<UserTable>(null);

  const [addUserModalVisible, setAddUserModalVisible] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const project: any = useSelector((state: any) => state.project);


  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await QUERY_ALL_USER([current, pageSize]);
      if (!data || !data.length) {
        // empty
        setTotal(0);
        setTableData([]);
        return;
      }
      const _tableData: UserTable[] = data.map((item: any) => ({
        key: item.user,
        name: item.name,
        account: item.user,
        type: item.type === 't0' ? 'normal' : 'admin'
      }));

      setTotal(data[0].count);
      setTableData(_tableData);
    } catch (error) {
      message.error(t('加载用户信息失败！'));
      message.error(error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [current, pageSize]);

  const onModifiedUser = React.useCallback(async (name: string, account: string, password: string | null) => {
    if (!name || !account) {
      message.error(t('请输入正确值！'));
      return;
    }

    setLoading(true);
    try {
      await ADMIN_MODIFY_NORMAL({
        data: {
          user: account,
          name,
          password
        }
      });
      // 修改成功，重新拉数据
      message.success(t('修改已保存'));
      loadData();
    } catch (error) {
      message.error(t('修改失败'));
      message.error(error.message || JSON.stringify(error));
      setLoading(false);
    }
  }, [loadData]);

  const onCreateUser = React.useCallback(async (name: string, password: string) => {
    setLoading(true);
    try {
      await ADMIN_CREATE_NORMAL({
        data: {
          name,
          password,
          type: 'normal'
        }
      });
      message.success(t('创建用户成功'));
      if (searchedValue && searchedValue.length) {
        // 有搜索，进行搜索更新
        handleSearchUser({ target: { value: searchedValue } });
      } else {
        loadData();
      }
    } catch (error) {
      message.error(error.message || JSON.stringify(error));
      message.error(t('创建新用户失败！'));
    } finally {
      setLoading(false);
    }
  }, [searchedValue]);

  const handleDeleteUser = React.useCallback(async (user: UserTable) => {
    setLoading(true);
    try {
      await ADMIN_DELETE_NORMAL({
        user: user.account
      });
      message.success(t('用户已删除'));
      if (searchedValue && searchedValue.length) {
        // 有搜索，进行搜索更新
        handleSearchUser({ target: { value: searchedValue } });
      } else {
        loadData();
      }
    } catch (error) {
      message.error(t('删除失败'));
      message.error(error.message || JSON.stringify(error));
      setLoading(false);
    }
  }, [searchedValue]);

  const handleSearchUser = React.useCallback(debounce((event: any) => {
    const searchValue = event.target.value;
    setSearchedValue(searchValue);

    setLoading(true);
    ADMIN_QUERY_SOME_USER([searchValue, DEFAULT_CURRENT, DEFAULT_PAGE_SIZE]).then(value => {
      setCurrent(DEFAULT_CURRENT);
      setPageSize(DEFAULT_PAGE_SIZE);
      if (!value || !value.length) {
        setTotal(0);
        setTableData([]);
        return;
      }
      const _tableData: UserTable[] = value.map((item: any) => ({
        key: item.user,
        name: item.name,
        account: item.user,
        type: item.type === 't0' ? 'normal' : 'admin'
      }));

      setTotal(value[0].count);
      setTableData(_tableData);
    }, error => {
      message.error(error.message || JSON.stringify(error));
      message.error(t('糟糕...服务器打瞌睡了...'));
    }).finally(() => {
      setLoading(false);
    });
  }, 500), []);

  // Component did mount
  React.useEffect(() => {
    setSearchedValue('');
  }, []);

  const renderTableTypeColumn = React.useCallback((type: keyof typeof USER_TYPE) => (
    <span>
      {type === 'admin' ? <Badge color={'blue'} /> : <Badge status={'success'} />}
      {USER_TYPE[type]}
    </span>
  ), []);

  const renderTableActionColumn = React.useCallback((_: any, record: UserTable) => (
    <Space size={'middle'}>
      <Typography.Link
        onClick={() => {
          setModifiedUser(record);
          setModifiedUserModalVisible(true);
        }}
      >
        {t('修改密码')}
      </Typography.Link>
      <Popconfirm
        title={t('确认要删除此用户？删除后数据不可恢复')}
        onConfirm={handleDeleteUser.bind(this, record)}
        okText={t('删除')}
        cancelText={t('取消')}
        okType={'danger'}
      >
        <Typography.Link>{t('删除')}</Typography.Link>
      </Popconfirm>
    </Space>
  ), []);

  const tableColumns = React.useMemo(() => ([{
    title: t('姓名'),
    dataIndex: 'name',
    key: 'name',
  }, {
    title: t('账号'),
    dataIndex: 'account',
    key: 'account',
  }, {
    title: t('权限'),
    dataIndex: 'type',
    key: 'type',
    render: renderTableTypeColumn
  }, {
    title: t('更多'),
    key: 'action',
    render: renderTableActionColumn
  }]), []);

  const handleTablePagination = React.useCallback((page: number, pageSize?: number) => {
    setCurrent(page);
    pageSize && setPageSize(pageSize);
  }, []);

  // Component did mount
  React.useEffect(() => {
    if (project.authHeaderKey) {
      loadData();
    }
  }, []);

  return (
    <React.Fragment>
      <div className={'users container'}>
        <ContainerHeader text={t('用户管理')} />
        <div className={'users-operations'}>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('按姓名搜索用户')}
            style={{ width: '50%' }}
            onChange={handleSearchUser.bind(this)}
          />
          <Button
            type={'primary'}
            onClick={setAddUserModalVisible.bind(this, true)}
          >
            {t('添加新用户')}
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={tableData}
          pagination={{ current, pageSize, total, onChange: handleTablePagination }}
          columns={tableColumns}
        />
      </div>
      <ModifyUserModal
        visible={modifiedUserModalVisible}
        onCancel={() => {
          setModifiedUserModalVisible(false);
          setModifiedUser(null);
        }}
        onOk={onModifiedUser}
        loading={loading}
        modifiedUser={modifiedUser}
      />
      <AddUserModal
        visible={addUserModalVisible}
        onCancel={setAddUserModalVisible.bind(this, false)}
        loading={loading}
        onOk={onCreateUser}
      />
    </React.Fragment>
  );
}

export default Users;