import React from 'react';
import ReactDOM from 'react-dom';
import AlertsSection from './AlertsSection';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AlertsSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});