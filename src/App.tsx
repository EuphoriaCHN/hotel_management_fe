import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { ConfigProvider, Layout } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import antdLocale from '@common/constants/antdLocale';

import Router from './Router';

import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import Sider from '@components/Sider/Sider';

import '@common/styles/base.scss';

type IProps = {};

function App(props: IProps) {
  return (
    <Provider store={store}>
      <ConfigProvider locale={antdLocale}>
        <BrowserRouter>
          <Layout>
            <Sider />
            <Layout className={'layout-container'}>
              <Header />
              <Router />
              <Footer />
            </Layout>
          </Layout>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default hot(App);