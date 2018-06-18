import React, {Component} from 'react';
import {observer} from 'mobx-react';

import AlertFixed from '../components/AlertFixed';
import Alert2 from '../components/Alerts2';
import AlertDialog from '../components/AlertDialog';
import MessageModel from '../components/MessageModel';
import Spinner from '../components/spinner/spinner';

import appStore from '../stores/GlobalStore';

@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}

  }

  render() {
    return (
      <div className="content">
          <Spinner />
          <Alert2 />
          <AlertDialog {...appStore.alertDialog.toJS()} />
          <AlertFixed />
          {this.props.children}
          <MessageModel />
      </div>
    );
  }
}

export default App;
