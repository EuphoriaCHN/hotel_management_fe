import * as React from 'react';

import './NotFound.scss';

type IProps = {};

function NotFound(props: IProps) {
    const render = React.useMemo(() => (
        <h1>NotFound</h1>
    ), []);
    return render;
}

export default NotFound;