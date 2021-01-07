import * as React from 'react';

import { Typography } from 'antd';

type IProps = {
  text: string;
  backIcon?: React.ReactNode;
  onBackIconClick?: () => void;
};

function ContainerHeader(props: IProps) {
  return (
    <header className={'container-header'}>
      <Typography.Title level={4}>
        {props.backIcon ? (
          <span onClick={props.onBackIconClick}>{props.backIcon}</span>
        ) : null}{props.text}
      </Typography.Title>
    </header>
  );
}

export default ContainerHeader;