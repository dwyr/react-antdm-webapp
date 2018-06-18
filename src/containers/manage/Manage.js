/*
 * 分级管理
 * dangwei@yonyou.com
 */
import React from 'react';
import {render} from 'react-dom';
import {observer} from 'mobx-react';
import {Scrollbars} from 'react-custom-scrollbars';

import OrgChart from '../../components/OrgChart.js';
import ManageModal from '../../components/manage/ManageModal';
import ManageStore from '../../stores/manage/ManageStore';


@observer
class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.store = new ManageStore();
    this.state = {
      isShow: false,   // 配置界面显示
    }
    this.initTreeData = this.initTreeData.bind(this);
  }

  componentDidMount() {
    document.title = '分级管理';
    let _this = this;

    // 初始化数据
    _this.initTreeData();

    // 点击配置按钮
    $('body').delegate('.second-menu', 'click', function () {
      var _thisData = $(this).parent()[0];
      _this.store.onClickDataSave = $(this).parent().find('.second-menu-icon');
      var paramData = _thisData.getAttribute('data-source');
      if (typeof paramData === 'string') {
        paramData = JSON.parse(paramData)
      }

      //console.log('编辑时的数据', paramData);

      _this.refs.managecard.show({paramData});
    });
  }

  componentWillUnmount() {
    $('body').undelegate('.second-menu', 'click', function () {
      return false;
    });
  }

  // 删除管控图标
  changeIcon = () => {
    let _this = this;
    if ($(_this.store.onClickDataSave).hasClass('hidden')) {
      $(_this.store.onClickDataSave).removeClass('hidden');
    }
    else {
      return;
    }
  }

  // 增加管控图标
  addIcon = () => {
    let _this = this;
    if (!$(_this.store.onClickDataSave).is('.hidden')) {
      $(_this.store.onClickDataSave).addClass('hidden');
    }
  }

  // 改变管控节点数据
  chanageIconData = (param) => {
    let _this = this;
    $(_this.store.onClickDataSave).parent().attr('data-source', JSON.stringify(param));
  }

  // 查询接口封装
  initTreeData() {
    let _this = this;
    _this.store.parentDataSource = [];
    _this.store.doGetManageData((data) => {

      let isInArray = (arrays, current)=> {
        const isIn = arrays.find((prod, i) => {
          if (prod.id === current.parentid) {
            return true;
          }
          return false;
        });
        return isIn;
      }

      let convert = root => {
        var resultRoot = []
        root.map((val)=> {
          val.children = null
        })
        for (var i = 0; i < root.length; i++) {
          var ri = root[i];
          if (ri.parentid == '' || ri.parentid == null || (!isInArray(root, ri))) {
            resultRoot.push(ri);
          } else {
            for (let j = 0; j < root.length; j++) {
              let rj = root[j];
              if (rj.id == ri.parentid) {
                rj.children = !rj.children ? [] : rj.children;
                rj.children.push(ri);
                break;
              }
            }
          }
        }
        return resultRoot;
      }

      //console.log('未处理数据', data.data);
      _this.store.parentDataSource = convert(data.data);
      //console.log('已处理数据', convert(data.data));
    })
    .then(() => {
        var orgchart
        _this.store.parentDataSource.map((item, index) => {
          return (

            orgchart = new OrgChart({
              'chartContainer': '#chart-container' + item.id,
              'data': item,
              'depth': 3,
              'pan': true,
              'nodeContent': 'title',
              'nodeID': 'id',
              'createNode': function (node, data) {
                var str;
                data.existsetting == true ? str = "<i class='cl cl-guanli second-menu-icon'></i>" : str = "<i class='cl cl-guanli second-menu-icon hidden'></i>";
                $(node).append(str + '<div class="second-menu">配置</div>');
              }
            })

          )
        });
      }
    );

  }

  render() {
    return (
      <div className="container-fluid" style={{'height': '100%'}}>
        <div className='chart-container'>
          <Scrollbars
            universal={true}
            autoHide={true}
            style={{ 'width':'100%','height':'100%','maxHeight':'100%' }}
          >
            {this.store.parentDataSource.length > 0 ?
              this.store.parentDataSource.map((value, index) => {
                return (<div key={index} style={{'display':'inline-block','height':'100%'}}
                             id={"chart-container"+ value.id}></div>)
              }) : (<div className="manage-fulltree">暂无数据</div>)}
          </Scrollbars>
        </div>
        <ManageModal
          ref="managecard"
          changeIcon={this.changeIcon}
          addIcon={this.addIcon}
          chanageIconData={this.chanageIconData}
        />
      </div>
    )
  }
}

export default Manage;