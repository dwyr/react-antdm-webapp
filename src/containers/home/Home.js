import React from 'react';
import {observer} from 'mobx-react';
/*
import {Carousel, WingBlank, TabBar, NavBar, Icon, Tabs, WhiteSpace, Badge} from 'antd-mobile';
import {Button, Switch} from 'bee-mobile';
*/
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
