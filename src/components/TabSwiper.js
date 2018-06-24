/**
 * Created by Administrator on 2018/6/24.
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Carousel, WingBlank} from 'antd-mobile';

@observer
class TabSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{
        id: 1,
        src: 'images/1.jpg'
      }, {
        id: 2,
        src: 'images/2.jpg'
      },
        {
          id: 3,
          src:'images/3.jpg'
        },{
          id: 4,
          src:'images/4.jpg'
        },{
          id: 5,
          src:'images/5.jpg'
        },{
          id: 6,
          src:'images/6.jpg'
        }],
      imgHeight: 176
    };
  }


  componentDidMount() {


  }

  render() {
    return (
      <WingBlank style={{'marginLeft':'0','marginRight':'0'}}>
        <Carousel
          autoplay={true}
          infinite
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map((val, index) => (
            <a
              key={index}
              href="http://www.alipay.com"
              style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
              <img
                src={val.src}
                alt={val.src}
                style={{ width: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}

export default TabSwiper;
