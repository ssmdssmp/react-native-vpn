import * as React from 'react';
import {Provider} from 'react-redux';
import {Navigation} from './screens/Navigation';
import {setupStore} from './store/store';

const store = setupStore();

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
