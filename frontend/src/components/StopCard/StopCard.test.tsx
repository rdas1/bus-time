import React from 'react';
import ReactDOM from 'react-dom';
import StopCard from './StopCard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StopCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});