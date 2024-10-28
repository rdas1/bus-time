import React from 'react';
import ReactDOM from 'react-dom';
import StopLabel from './StopLabel';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StopLabel />, div);
  ReactDOM.unmountComponentAtNode(div);
});