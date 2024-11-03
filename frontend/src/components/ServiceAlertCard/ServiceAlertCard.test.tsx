import React from 'react';
import ReactDOM from 'react-dom';
import ServiceAlertCard from './ServiceAlertCard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ServiceAlertCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});