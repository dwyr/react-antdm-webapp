import React, {Component} from 'react';
import {observer} from 'mobx-react';
import 'bee-mobile/dist/bee-mobile.min.css';


import appStore from '../stores/GlobalStore';


@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
}

export default App;
