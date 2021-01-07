import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IdentityType } from '@common/constants';

import { Form, Input, Select, Tooltip, Space } from 'antd';

import { FormListFieldData } from 'antd/lib/form/FormList';

import {
  UserOutlined,
  PhoneOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';

type IProps = {
  formField: FormListFieldData;
  onRemove?: any;
};

function CheckInUserInfoForm(props: IProps) {
  const { t } = useTranslation();

  const { formField } = props;

  return (
    <div className={'check-in-user-info-form'} key={formField.fieldKey}>
      <Form.Item
        {...formField}
        label={t('客人姓名')}
        name={[formField.name, 'hosingName']}
        fieldKey={[formField.key, 'hosingName']}
      >
        <Input prefix={<UserOutlined />} placeholder={t('请输入客户姓名')} allowClear autoFocus />
      </Form.Item>
      <Form.Item
        {...formField}
        label={t('联系方式')}
        name={[formField.name, 'hosingPhone']}
        fieldKey={[formField.key, 'hosingPhone']}
      >
        <Input prefix={<PhoneOutlined />} placeholder={t('请输入客户联系方式')} allowClear />
      </Form.Item>
      <Form.Item
        {...formField}
        label={t('证件信息')}
        fieldKey={[formField.key, 'identity']}
        noStyle
      >
        <Input.Group compact>
          <Form.Item
            {...formField}
            name={[formField.name, 'identity', 'type']}
            fieldKey={[formField.key, 'identity', 'type']}
            noStyle
          >
            <Select style={{ width: '35%' }} placeholder={t('请选择证件类型')}>
              {Object.keys(IdentityType).map(key => (
                <Select.Option value={key}>{IdentityType[key]}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            {...formField}
            name={[formField.name, 'identity', 'id']}
            fieldKey={[formField.key, 'identity', 'id']}
            noStyle
          >
            <Input style={{ width: '65%' }} placeholder={t('请输入证件编号')} allowClear />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Tooltip title={t('移除此项')}>
        <MinusCircleOutlined className={'check-in-user-info-form-remove'} onClick={props.onRemove} />
      </Tooltip>
    </div>
  );
}

export default CheckInUserInfoForm;