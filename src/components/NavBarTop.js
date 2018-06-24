/**
 * Created by Administrator on 2018/6/24.
 */
import React from 'react';
import { NavBar, Icon } from 'antd-mobile';


class NavBarTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
  return(
    <div>
      <NavBar
        mode="light"
        icon={<Icon type="left" />}
        leftContent="返回"
        onLeftClick={() => console.log('onLeftClick')}
        rightContent={[
        <Icon key="1" type="ellipsis" />
      ]}>{this.props.name}</NavBar>
    </div>
  )}
}


export default NavBarTop;