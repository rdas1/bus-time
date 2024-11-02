import React from 'react';
import ReactDOM from 'react-dom';
import MapWidget from './MapWidget';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MapWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});