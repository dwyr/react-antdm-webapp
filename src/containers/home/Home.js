import React from 'react';
import {observer} from 'mobx-react';
import TabBarDone from '../../components/TabBarDone';


@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <TabBarDone />
      </div>
    )
  }
}


export default Home;
