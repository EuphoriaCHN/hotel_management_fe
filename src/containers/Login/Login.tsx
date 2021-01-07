import * as React from 'react';
import { Carousel, Form, Input, Button, Typography, Tooltip, message, Switch } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { LOGIN } from '@api';

import { setUser } from '@store/user';
import { setAuthKey } from '@store/project';

import './Login.scss';

const webpackContext = require.context('../../common/images/loginCarouselImages', true, /\.jpg$/);
const carouselBackgroundImages = webpackContext.keys().reduce((modules, path) => {
  const name = path.replace(/^\.\/(.*)\..+$/, '$1');
  const module = webpackContext(path);
  modules[name] = module.default;
  return modules;
}, {});

type IProps = {};

const caruselBaseStyle: React.CSSProperties = {
  height: '100vh',
  backgroundColor: '#364d79',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

function Login(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const onFormSubmit = React.useCallback<
    (_: { userName: string; password: string; isAdmin: boolean; }) => Promise<unknown>
  >(async ({ userName, password, isAdmin }) => {
    const errorMessage = !userName ? t('用户名不能为空') : !password ? t('密码不能为空') : null;
    if (errorMessage) {
      message.error(errorMessage);
      return;
    }
    setLoading(true);
    try {
      const { authHeaderKey, authHeaderValue } = await LOGIN({
        data: {
          user: userName,
          password: password,
          type: isAdmin ? 'admin' : 'normal'
        }
      });
      dispatch(setUser({
        type: isAdmin ? 'admin' : 'normal',
        account: userName,
        password
      }));
      dispatch(setAuthKey({
        authHeaderKey,
        authHeaderValue,
      }));
      // 登录成功，redirect
      message.success(t('登录成功'));
      history.replace('/platform');
    } catch (error) {
      message.error(t('登录失败!'));
      message.error(error.message || JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const render = React.useMemo(() => (
    <div className={'login-page'}>
      <div className={'login-page-form-box'}>
        <Typography.Title title={'h2'}>
          {t('酒店管理系统')}
        </Typography.Title>
        <Form
          name={'normal_login'}
          className={'login-form'}
          initialValues={{ remember: true }}
          onFinish={onFormSubmit}
        >
          <Form.Item
            name={'userName'}
            rules={[{ required: true, message: t('用户名为必填项!') }]}
          >
            <Input prefix={<UserOutlined className={'site-form-item-icon'} />} placeholder={t('用户名')} allowClear autoFocus />
          </Form.Item>
          <Form.Item
            name={'password'}
            rules={[{ required: true, message: t('密码为必填项!') }]}
          >
            <Input.Password
              prefix={<LockOutlined className={'site-form-item-icon'} />}
              type={'password'}
              placeholder={t('密码')}
              allowClear
            />
          </Form.Item>
          <Form.Item label={t('是否为管理员')} name={'isAdmin'}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type={'primary'} htmlType={'submit'} block>
              {t('登录')}
            </Button>
          </Form.Item>
          <Form.Item className={'more-operation'}>
            <Tooltip title={t('请联系管理员修改密码')}>
              <Typography.Link>{t('忘记密码？')}</Typography.Link>
            </Tooltip>
          </Form.Item>
        </Form>
      </div>
      <Carousel
        effect={'fade'}
        dotPosition={'right'}
        autoplay
      >
        {Object.values(carouselBackgroundImages).map(image => (
          <div>
            <div
              style={Object.assign({}, caruselBaseStyle, { backgroundImage: `url(${image})` })}
            />
          </div>
        ))}
      </Carousel>
    </div>
  ), [loading]);
  return render;
}

export default Login;