import * as React from 'react';
import { connect } from 'react-redux';
import Filters from './Filters';
import Allocations from './Allocations/index';
import * as d3 from 'd3';

window['d3'] = d3;

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Filters></Filters>
        <Allocations top={20} right={20} bottom={20} left={100} />
      </div>
    );
  }
}

export default connect(state => state)(App);