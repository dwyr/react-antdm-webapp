/**
 * Created by Administrator on 2018/6/24.
 */
import React from 'react';
import {observer} from 'mobx-react';
import { Tabs, WhiteSpace } from 'antd-mobile';
import NavBarTop from '../../components/NavBarTop'
import {LazyLoad } from 'bee-mobile';


@observer
class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        { title: '1 Tab' },
        { title: '2 Tab' },
        { title: '3 Tab' }
      ]
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div style={{ height: '250px' }}>
        <NavBarTop name="阅读"/>
        <div>

            <img src="images/image1.jpg" style={{width: '100%'}} alt=""/>

          <div className="padding-10">
            React, 为移动而生的的React组件库。经过近百个日夜的不懈努力，发布的时机终于到来！
            无论它最后能走多远，都无怨无悔。至少我曾倾注心血，未来更会投入更多！
          </div>

            <img src="images/image2.jpg" style={{width: '100%'}} alt=""/>

          <div className="padding-10">
            React，为移动而生的的React组件库。经过近百个日夜的不懈努力，发布的时机终于到来！
            无论它最后能走多远，都无怨无悔。至少我曾倾注心血，未来更会投入更多！
          </div>

            <img src="images/image3.jpg" style={{width: '100%'}} alt=""/>

            <img src="images/image4.jpg" style={{width: '100%'}} alt=""/>

        </div>
      </div>
    )
  }
}

export default News;

