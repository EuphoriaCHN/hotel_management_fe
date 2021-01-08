import * as React from 'react'
import { useTranslation } from 'react-i18next';
import { ROOM_TYPE } from '@common/constants';

import { Modal, Form, Input, Select } from 'antd';

import { RoomTypeRes } from '@containers/RoomManagement/RoomManagement';

type IProps = {
  visible: boolean;
  onCancel: () => void;
  onOk: (type: keyof typeof ROOM_TYPE, price: number) => Promise<any>;
  loading: boolean;
  modifiedInstance?: RoomTypeRes;
};

const AddRoomTypeModal: React.SFC<IProps> = props => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOnSubmit = () => {
    const type = form.getFieldValue('type');
    const price = form.getFieldValue('price');

    props.onOk(type, price);
  };

  const { loading } = props;

  return (
    <Modal
      title={!!props.modifiedInstance ? t('添加房间类型') : t('修改房间价格')}
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
        initialValues={{
          type: (props.modifiedInstance || {}).roomType,
          price: (props.modifiedInstance || {}).roomPrice
        }}
      >
        <Form.Item
          label={t('房间类型')}
          rules={[{ required: true, message: t('此项为必填字段') }]}
          name={'type'}
        >
          <Select
            disabled={!!props.modifiedInstance}
            placeholder={t('请选择房间类型')}
          >
            {Object.keys(ROOM_TYPE).map(typeKey => (
              <Select.Option value={typeKey}>{ROOM_TYPE[typeKey]}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('房间价格')}
          name={'price'}
          rules={[{ required: true, message: t('此项为必填字段') }]}
        >
          <Input
            type={'number'}
            placeholder={t('请输入房间价格')}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRoomTypeModal;