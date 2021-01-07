import * as React from 'react'
import { useTranslation } from 'react-i18next';

import { Modal, Form, Input, message } from 'antd';

type IProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (name: string, password: string) => Promise<any>;
  loading: boolean;
};

const AddUserModal: React.SFC<IProps> = props => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnSubmit = () => {
    const name = form.getFieldValue('name');
    const password = form.getFieldValue('password');

    if (!name || !name.length || !password || !password.length) {
      message.error(t('请输入正确值！'));
      return;
    }

    if (password.length < 6 || password.length > 16) {
      message.error(t('密码长度需要在 6 到 16 个字符之间'));
      return;
    }

    props.onOk(name, password);
  };

  const { loading } = props;

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
      >
        <Form.Item
          label={t('姓名')}
          rules={[{ required: true, message: t('此项为必填字段') }]}
          name={'name'}
        >
          <Input placeholder={t('请输入姓名')} allowClear />
        </Form.Item>
        <Form.Item
          label={t('密码')}
          name={'password'}
          rules={[{ required: true, message: t('此项为必填字段') }]}
        >
          <Input.Password
            type={'password'}
            placeholder={t('请输入密码')}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;