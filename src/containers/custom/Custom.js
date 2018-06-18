/*
 * 定义自定义项
 * dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';
import CustomViewMoreModal from '../../components/custom/CustomViewMoreModal';
import CustomStore from '../../stores/custom/CustomStore';

@observer
class Custom extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {}

    this.handleClick = this.handleClick.bind(this);
    this.handleTransform = this.handleTransform.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
  }

  componentDidMount() {
    document.title = "自定义项";
    this.store.getDocs();
  }

  // 查看更多按钮
  handleClick(param1, param2, param3, param4) {
    let _this = this;
    _this.refs.viewMore.show({param:param1.slice(),extendFlag:param2,id:param3,name:param4});
  }

  // 转换配置显示
  handleTransform(param) {
    if(param && param.length == 0) {
      return (<button className="btn btn-primary custom-bto">配置显示</button>)
    } else if(param && param.length == 1) {
      return (<button className="btn btn-primary custom-btop">配置显示</button>)
    } else {
     return (<button className="btn btn-primary custom-bomLeft">配置显示</button>)
    }
  }

  // 刷新页面
  refreshPage() {
    this.store.getDocs();
  }


  render() {
    return (
      <div className="currency-content container-fluid" style={{'paddingBottom': '0'}}>
        <div className="currency-title custom-title">
          定义自定义项的项目
        </div>
        <div className="custom-row clearfix">
          {this.store.docustoms.map((item, index) => {
            return (
              <div key={index} className="custom-col-5">
                <div className="custom-co">
                  <div className="cusom-t"><img src={item.src} alt=""/></div>
                  <Link to={"/customlist/"+item.doctype} className={item.subDoccustom.length ==1 ? 'btn-custom custom-pc1':"btn-custom custom-pc"}>{item.name}</Link>

                  {item.subDoccustom.length >= 2 ?
                    <button onClick={this.handleClick.bind(this, item.subDoccustom, item.extendFlag, item.id, item.name)} className="btn btn-default custom-bomRight">查看更多</button>
                     :item.subDoccustom.map((value, index) => {
                      return ( <Link key={index} to={"/customlist/"+value.doctype}
                                     className="btn-custom custom-pt1">{value.name}</Link>)
                  })}

                  {this.handleTransform(item.subDoccustom)}

                </div>
              </div>)
          })}
        </div>

        <CustomViewMoreModal ref='viewMore' refreshPage={this.refreshPage}/>

      </div>
    )
  }
}

export default Custom;