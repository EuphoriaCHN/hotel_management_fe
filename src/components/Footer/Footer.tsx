import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import './Footer.scss';

type IProps = WithTranslation;

const Footer: React.FC<IProps> = props => {
  const render: JSX.Element = React.useMemo(
    () => (
      <footer className={'footer'}>
        <span>Copyright &copy; 2021 </span>
        <a target="__blank" href="https://github.com/EuphoriaCHN/hotel_management_fe" rel="noopener noreferrer">
          XUST SE1701 GROUP 4.
        </a>
        <span>All Rights Reserved.</span>
      </footer>
    ),
    [props.i18n.language]
  );

  return render;
}

export default withTranslation()(Footer);
