import React from 'react';
import { shallow, mount, render } from 'enzyme';
import App from '../src/App';

describe('<App />', () => {
  it('should mount in a full DOM', () => {
    const component = mount(<App />);
    expect(component.find('.app').length).toBe(1);
  });
});