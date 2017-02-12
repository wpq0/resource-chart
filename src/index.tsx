import 'babel-polyfill';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';
import App from './components/app';

const store = configureStore(undefined, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'))