import * as React from 'react'
import { useTranslation } from 'react-i18next';

import ContainerHeader from '@components/ContainerHeader/ContainerHeader';

import './Search.scss'

type IProps = {};

const Search: React.SFC<IProps> = props => {
  const { t } = useTranslation();

  return (
    <div className={'container search'}>
      <ContainerHeader text={t('信息查询')} />
    </div>
  );
};

export default Search;