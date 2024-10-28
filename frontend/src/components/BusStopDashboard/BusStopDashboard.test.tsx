import React from 'react';
import ReactDOM from 'react-dom';
import BusStopDashboard from './BusStopDashboard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BusStopDashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});