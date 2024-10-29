import React from 'react';
import ReactDOM from 'react-dom';
import LaterArrivalsSection from './LaterArrivalsSection';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LaterArrivalsSection />, div);
  ReactDOM.unmountComponentAtNode(div);
});