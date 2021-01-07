import * as React from 'react'
import { useTranslation } from 'react-i18next';
import ContainerHeader from '@components/ContainerHeader/ContainerHeader';

import './RoomManagement.scss'

type IProps = {};

const RoomManagement: React.SFC<IProps> = props => {
  const { t } = useTranslation();

  return (
    <div className={'container room-management'}>
      <ContainerHeader text={t('客房管理')} />
    </div>
  );
};

export default RoomManagement;