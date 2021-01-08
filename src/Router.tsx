import * as React from 'react';
import { Route, Switch } from 'react-router';

import Login from '@containers/Login/Login';
import Platform from '@containers/Platform/Platform';
import DashBoard from '@containers/DashBoard/DashBoard';
import About from '@containers/About/About';
import Users from '@containers/Users/Users';
import RoomManagement from '@containers/RoomManagement/RoomManagement';
import Reservation from '@containers/Reservation/Reservation';
import Search from '@containers/Search/Search';

import NotFound from '@containers/NotFound/NotFound';

const Router: React.FC<{}> = () => {
  return (
    <Switch>
      <Route path={'/search'} component={Search} />
      <Route path={'/roomReservation'} component={Reservation} />
      <Route path={'/roomInfoManagement'} component={RoomManagement} />
      <Route path={'/dashboard'} component={DashBoard} />
      <Route path={'/userInfoManagement'} component={Users} />
      <Route path={'/about'} component={About} />
      <Route path={'/platform'} component={Platform} />
      <Route path={'/login'} component={Login} />
      <Route path={'/'} component={Platform} exact />
      <Route path={'*'} component={NotFound} />
    </Switch>
  );
};

export default Router;