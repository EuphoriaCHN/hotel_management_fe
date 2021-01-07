import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { USER_TYPE } from '@common/constants';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';

import { Descriptions, Button, Modal, Form, Input, message, Badge } from 'antd';

import { MODIFY_ADMIN_PASSWORD, MODIFY_NORMAL_PASSWORD } from '@api';
import { setAuthKey } from '@store/project';

import './DashBoard.scss';

type IProps = {};

function DashBoard(props: IProps) {
  const [modifyPasswordModalVisible, setModifyPasswordModalVisible] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const user: any = useSelector<any>(state => state.user);
  const dispatch = useDispatch();

  const onSubmitModifyPassword = React.useCallback(async () => {
    const [oldPassword, newPassword, ensure] = ['oldPassword', 'newPassword', 'ensure'].map(item => form.getFieldValue(item));
    let errorMessage = null;
    switch (true) {
      case newPassword !== ensure:
        errorMessage = t('两次输入的新密码不一致！');
        break;
      case newPassword.length < 6:
        errorMessage = t('密码长度不得小于 6 位！');
        break;
      case oldPassword !== user.password:
        errorMessage = t('旧密码不正确！');
        break;
      case oldPassword === newPassword:
        errorMessage = t('新旧密码不能相同！');
    }
    if (errorMessage) {
      message.error(errorMessage);
      return;
    }

    try {
      // todo:: 修改普通用户
      if (user.type === 'normal') {
        await MODIFY_NORMAL_PASSWORD({
          data: {
            user: user.account,
            name: user.account,
            password: newPassword
          }
        });
      } else {
        await MODIFY_ADMIN_PASSWORD({
          data: {
            user: user.account,
            name: user.account,
            password: newPassword
          }
        });
      }
      // 修改密码成功，清除用户数据，重新登录
      dispatch(setAuthKey({
        authHeaderKey: null,
        authHeaderValue: null
      }));
      message.success(t('修改密码成功，请重新登录！'));
      history.replace('/login');
    } catch (error) {
      message.error(t('修改密码失败'));
      message.error(error);
    }
  }, [user]);

  const render = React.useMemo(() => (
    <React.Fragment>
      <div className={'container dashboard'}>
        <ContainerHeader text={t('个人中心')} />
        <Descriptions bordered>
          <Descriptions.Item label={t('用户名')} span={2}>
            {user.account || ''}
          </Descriptions.Item>
          <Descriptions.Item label={t('权限')} span={1}>
            {user.type === 'admin' ? <Badge color={'blue'} /> : <Badge status={'success'} />}
            {USER_TYPE[user.type]}
          </Descriptions.Item>
          <Descriptions.Item label={t('密码')} span={3}>
            <Button type={'primary'} onClick={setModifyPasswordModalVisible.bind(this, true)}>{t('修改密码')}</Button>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Modal
        title={t('修改密码')}
        visible={modifyPasswordModalVisible}
        onOk={onSubmitModifyPassword}
        onCancel={setModifyPasswordModalVisible.bind(this, false)}
      >
        <Form form={form}>
          <Form.Item
            name={'oldPassword'}
            label={t('旧密码')}
            rules={[{ required: true, message: t('此项为必填项!') }]}
          >
            <Input.Password
              type={'password'}
              placeholder={t('请输入旧密码')}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name={'newPassword'}
            label={t('新密码')}
            rules={[{ required: true, message: t('此项为必填项!') }]}
          >
            <Input.Password
              type={'password'}
              placeholder={t('请输入新密码')}
              allowClear
            />
          </Form.Item>
          <Form.Item
            name={'ensure'}
            label={t('二次确认')}
            rules={[{ required: true, message: t('此项为必填项!') }]}
          >
            <Input.Password
              type={'password'}
              placeholder={t('请再次输入新密码')}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  ), [modifyPasswordModalVisible]);
  return render;
}

export default DashBoard;