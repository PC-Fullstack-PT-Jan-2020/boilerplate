import React from 'react';
import '../styles/App.css';
import { Provider } from 'react-redux'
import store from '../redux/store'
import Example from './Example'
export default () => <div>
  <Provider store={store}>
    <Example />
  </Provider>
</div>
