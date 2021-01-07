import * as React from 'react'
import { useTranslation } from 'react-i18next';

import { Modal, Form, Input, Tooltip } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { UserTable } from '@containers/Users/Users';

type IProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (name: string, account: string, password: string | null) => Promise<any>;
  loading: boolean;
  modifiedUser: UserTable;
};

const ModifyUserModal: React.SFC<IProps> = props => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnSubmit = () => {
    const name = form.getFieldValue('name') || (modifiedUser || {}).name;
    const account = (modifiedUser || {}).account;
    const password = form.getFieldValue('password') || null;

    props.onOk(name, account, password);
  };

  const { loading, modifiedUser } = props;

  return (
    <Modal
      title={t('修改用户')}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={handleOnSubmit}
      okButtonProps={{ loading }}
      cancelButtonProps={{ disabled: loading }}
      maskClosable={false}
    >
      <Form
        name={'modifiedUser'}
        form={form}
        initialValues={{ account: (modifiedUser || {}).account }}
      >
        <Form.Item
          label={t('姓名')}
          rules={[{ required: true, message: t('此项为必填字段') }]}
          name={'name'}
        >
          <Input defaultValue={(modifiedUser || {}).name} placeholder={t('请输入姓名')} allowClear />
        </Form.Item>
        <Form.Item
          label={t('账号')}
          name={'account'}
        >
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item
          label={t('密码')}
          name={'password'}
        >
          <Input.Password
            prefix={(
              <Tooltip title={t('不填则为不修改密码')}>
                <QuestionCircleOutlined />
              </Tooltip>
            )}
            type={'password'}
            placeholder={t('请输入新密码')}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModifyUserModal;