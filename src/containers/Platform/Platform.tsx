import * as React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { chunk } from 'lodash-es';

import { IdentityType, REGEXP } from '@common/constants';

import { Card, Form, Checkbox, Input, Button, Row, Col } from 'antd';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';

import CheckInUserInfoForm from './CheckInUserInfoForm';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  ContainerOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import './Platform.scss';

type IProps = {};

function Platform(props: IProps) {
  const [hasReverse, setHasReverse] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<'checkIn' | 'checkOut'>(null);
  const { t, i18n } = useTranslation();

  const [form] = Form.useForm();

  const cardItems = React.useMemo(() => ([{
    label: t('入住登记'),
    coverIcon: <CheckCircleOutlined />,
    coverClassName: 'check-in-card-cover',
    onClick: setStatus.bind(this, 'checkIn')
  }, {
    label: t('离店登记'),
    coverIcon: <CloseCircleOutlined />,
    coverClassName: 'check-out-card-cover',
    onClick: () => { }
  }]), [i18n.language]);

  const renderSelectStatusCard = React.useMemo(() => (
    <div className={'platform-card-container'}>
      {cardItems.map(item => (
        <Card
          className={'platform-card'}
          cover={<div className={classnames('platform-card-cover', item.coverClassName)}>{item.coverIcon}</div>}
          onClick={item.onClick}
          hoverable
        >
          <Card.Meta title={item.label} />
        </Card>
      ))}
    </div>
  ), [status]);

  /**
   * 输入完成订单号，查询订单详情
   */
  const onReverseIDBlur = React.useCallback(() => {
    const reverseID = form.getFieldValue('reverseID');
    if (!reverseID) {
      return;
    }

  }, []);

  const onCheckInFormFinish = React.useCallback(({ guests }) => {
    console.log(guests);
    return;
    // if (hasReverse) {
    //   if (!reverseID) {
    //     message.error(t('请输入预订订单号！'));
    //     return;
    //   }
    // } else {
    //   let errorMessage: string = null;
    //   switch (undefined) {
    //     case hosingName:
    //       errorMessage = t('请输入客户姓名');
    //       break;
    //     case hosingPhone:
    //       errorMessage = t('请输入客户联系方式');
    //       break;
    //     case identity.type:
    //       errorMessage = t('请选择证件类型');
    //       break;
    //     case identity.id:
    //       errorMessage = t('请输入证件编号');
    //   }
    //   if (errorMessage) {
    //     message.error(errorMessage);
    //     return;
    //   }
    //   switch (false) {
    //     case REGEXP.name.test(hosingName):
    //       errorMessage = t('姓名格式错误！');
    //       break;
    //     case REGEXP.phone.test(hosingPhone):
    //       errorMessage = t('联系方式格式错误！');
    //       break;
    //   }
    //   if (errorMessage) {
    //     message.error(errorMessage);
    //     return;
    //   }
    //   switch (IdentityType[identity.type]) {
    //     case IdentityType.ID:
    //       REGEXP.id.test(identity.id) || (errorMessage = t('身份证格式错误'));
    //       break;
    //     case IdentityType.DRIVER_LICENSE:
    //       REGEXP.driver.test(identity.id) || (errorMessage = t('驾驶证格式错误'));
    //       break;
    //     case IdentityType.CERTIFICATE:
    //       REGEXP.certificate.test(identity.id) || (errorMessage = t('军官证格式错误'));
    //   }
    //   if (errorMessage) {
    //     message.error(errorMessage);
    //     return;
    //   }
    // }
  }, [hasReverse]);

  const renderCheckinTab = React.useMemo(() => (
    <div className={'platform-tab'}>
      <ContainerHeader text={t('入住登记')} backIcon={<ArrowLeftOutlined />} onBackIconClick={setStatus.bind(this, null)} />
      <div className={'platform-container'}>
        <Form
          className={'platform-checkin-form'}
          onFinish={onCheckInFormFinish}
          form={form}
          autoComplete={'off'}
        >
          <Form.Item>
            <Checkbox checked={hasReverse} onChange={setHasReverse.bind(this, (prev: boolean) => !prev)}>{t('是否有预订')}</Checkbox>
          </Form.Item>
          {hasReverse ? (
            <Form.Item name={'reverseID'}>
              <Input prefix={<ContainerOutlined />} placeholder={t('订单号')} onBlur={onReverseIDBlur} allowClear autoFocus />
            </Form.Item>
          ) : (
              <Form.List name="guests">
                {(fields, { add, remove }) => {
                  const chunks = chunk(fields.map(field => (
                    <CheckInUserInfoForm formField={field} onRemove={remove.bind(this, field.name)} />
                  )), 2);
                  return (
                    <React.Fragment>
                      {chunks.map(row => (
                        <Row gutter={32}>
                          {row.map(col => <Col span={12}>{col}</Col>)}
                        </Row>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={add} block icon={<PlusOutlined />}>
                          {t('增加客户')}
                        </Button>
                      </Form.Item>
                    </React.Fragment>
                  );
                }}
              </Form.List>
            )}
          <Form.Item>
            <Button type={'primary'} htmlType={'submit'} block>{t('提交信息')}</Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  ), [hasReverse, onCheckInFormFinish]);

  return (
    <div className={'platform container'}>
      {status === null ? renderSelectStatusCard : renderCheckinTab}
    </div>
  );
}

export default Platform;