import * as React from 'react'
import { useTranslation } from 'react-i18next';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';

import './Reservation.scss'

type IProps = {};

const Reservation: React.SFC<IProps> = props => {
  const { t } = useTranslation();

  return (
    <div className={'container reservation'}>
      <ContainerHeader text={t('客房预定')} />
    </div>
  );
};

export default Reservation;