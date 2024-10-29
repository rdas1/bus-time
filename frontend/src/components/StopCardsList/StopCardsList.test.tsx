import React from 'react';
import ReactDOM from 'react-dom';
import StopCardsList from './StopCardsList';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StopCardsList />, div);
  ReactDOM.unmountComponentAtNode(div);
});