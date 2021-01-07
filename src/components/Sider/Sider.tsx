import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import * as H from 'history';

import { Layout, Menu, Tooltip } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import {
  SearchOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
  CarryOutOutlined,
  SendOutlined,
  UserOutlined
} from '@ant-design/icons';

import './Sider.scss';

type SIDER_DATA = {
  k: string;
  icon: React.ReactElement;
  value?: string;
  title?: string;
  auth?: Array<number>;
  children?: Array<SIDER_DATA>;
};

function Sider(props: {}) {
  const [menuKey, setMenuKey] = React.useState('platform');
  const [collapsed, setCollapsed] = React.useState(false);

  const _history: H.History<H.LocationState> = useHistory();
  const _location = useLocation();

  const { t, i18n } = useTranslation();

  const getTitle: null | React.ReactNode = collapsed ? (
    <div className={'collapsed-title'} />
  ) : (
      <Tooltip title={t('酒店管理系统')}>
        <h3 className={'title'}>{t('酒店管理系统')}</h3>
      </Tooltip>
    );

  const handleChangeRoute = React.useCallback((param: MenuInfo) => {
    const { key } = param;
    _history.push(`/${key}`);
  }, []);

  const siderData = React.useMemo<Array<SIDER_DATA>>(() => ([
    { k: 'platform', icon: <SendOutlined />, value: t('入住 & 离店') },
    { k: 'roomReservation', icon: <CarryOutOutlined />, value: t('客房预订') },
    { k: 'search', icon: <SearchOutlined />, value: t('信息查询') },
    { k: 'roomInfoManagement', icon: <HomeOutlined />, value: t('客房管理') },
    { k: 'userInfoManagement', icon: <UsergroupAddOutlined />, value: t('用户管理') },
    { k: 'dashboard', icon: <UserOutlined />, value: t('个人中心') },
    { k: 'about', icon: <QuestionCircleOutlined />, value: t('关于') },
  ]), []);

  const getSiderItem = React.useCallback((item: SIDER_DATA) => {
    // todo:: Authorization
    if (item.k && item.k.length) {
      return (
        <Menu.Item key={item.k} icon={item.icon} onClick={handleChangeRoute}>
          {item.value}
        </Menu.Item>
      );
    }
    return (
      <Menu.SubMenu icon={item.icon} title={item.title}>
        {item.children.map(getSiderItem)}
      </Menu.SubMenu>
    );
  }, []);

  React.useEffect(() => {
    if (_location.pathname === '/') {
      _history.replace('/platform');
    } else {
      const nowLocation = _location.pathname.split(/\/(.*)/)[1];
      nowLocation && setMenuKey(nowLocation);
    }
  }, [_location.pathname]);

  const render: JSX.Element = React.useMemo(
    () => (
      <Layout.Sider
        className={'sider'}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsible
      >
        {getTitle}
        <Menu
          theme={'dark'}
          selectedKeys={[menuKey]}
          onSelect={({ selectedKeys }) => setMenuKey(selectedKeys[0] as string)}
          mode={'inline'}
        >
          {siderData.map(getSiderItem)}
        </Menu>
      </Layout.Sider>
    ),
    [collapsed, i18n.language, menuKey]
  );

  return render;
};

export default Sider;
