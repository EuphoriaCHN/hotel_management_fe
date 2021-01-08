import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuInfo } from 'rc-menu/lib/interface';
import classnames from 'classnames';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { LOCALE } from '@common/constants/locale';

import { LOGOUT, CHECK_SESSION } from '@api';
import { setAuthKey } from '@store/project';

import { Dropdown, Button, Menu, message } from 'antd';
import { GlobalOutlined, CheckOutlined } from '@ant-design/icons';

import './Header.scss';

type IProps = {};

function Header(props: IProps) {
  const { i18n, t } = useTranslation();
  const _locale: string = i18n.language;
  const [localeDropdownVisible, setLocaleDropdownVisible] = React.useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const project: any = useSelector<any>(state => state.project);
  const user: any = useSelector<any>(state => state.user);

  const handleI18n = (param: MenuInfo): void => {
    const { key } = param;

    if (key !== _locale) {
      Cookies.set('locale', key as string);
      i18n.changeLanguage(key as string);
    }
  };

  React.useEffect(() => {
    // store 里没存
    if (!project.authHeaderValue) {
      const sessionState = window.sessionStorage.getItem('Authorization');
      if (!sessionState) {
        // 未登录
        history.replace('/login');
        return;
      }
      // CHECK_SESSION({
      //   data: {
      //     token: sessionState
      //   }
      // });
    }
  }, []);

  const menu: React.ReactElement = (
    <Menu>
      {Object.keys(LOCALE).map(
        (language: string): JSX.Element => {
          const activity = _locale === language;
          const classNames = classnames({ 'local-activity': activity });
          return (
            <Menu.Item key={language} onClick={handleI18n}>
              <div className={classNames}>
                {activity ? <CheckOutlined /> : null}
                {LOCALE[language]}
              </div>
            </Menu.Item>
          );
        }
      )}
    </Menu>
  );

  const handleLogOut = React.useCallback(async () => {
    try {
      await LOGOUT({
        data: {
          user: user.account,
          password: user.password,
          type: user.type
        }
      });
      dispatch(setAuthKey({
        authHeaderKey: null,
        authHeaderValue: null
      }));
      message.success(t('注销成功'));
      history.replace('/login');
    } catch (error) {
      message.error(t('注销失败'));
      message.error(error);
    }
  }, [user]);

  const handleToggleLocaleDropdownVisible = React.useCallback(() => {
    setLocaleDropdownVisible(prev => !prev);
  }, [])

  return (
    <header className={'header'}>
      <span className={'say-hello'}>
        {t('欢迎！')}
        {user.account || ''}
      </span>
      <Button className={'log-out'} type={'link'} onClick={handleLogOut}>{t('注销')}</Button>
      <Dropdown overlay={menu} visible={localeDropdownVisible} onVisibleChange={handleToggleLocaleDropdownVisible}>
        <Button>
          {t(LOCALE[_locale])} <GlobalOutlined />
        </Button>
      </Dropdown>
    </header>
  );
};

export default Header;
