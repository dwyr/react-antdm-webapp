/*
 * 分级管理配置
 * dangwei@yonyou.com
 */
import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {observer} from 'mobx-react'
import {Checkbox, Radio} from 'tinper-bee';
import {Scrollbars} from 'react-custom-scrollbars';

import GlobalStore from '../../stores/GlobalStore';
import ManageStore from '../../stores/manage/ManageStore';

@observer
class ManageModal extends Component {
  constructor(props) {
    super(props)
    this.store = new ManageStore();
    this.state = {
      isShow: false,        // 弹出是否显示
      checkedFlag: false,   // 复选框
      isChecked: false,     // 单选框
    }

    this.close = this.close.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

  }

  // 打开
  show(param) {
    let {paramData} = param;
    this.setState({isShow: true});
    Object.assign(this.store.paramData, paramData);
    Object.assign(this.store.docTypes, paramData.docTypes);
    this.store.selectedDataId = paramData.id;
  }

  // 关闭
  close() {
    this.setState({isShow: false});
    this.store.docTypes = [];
    this.store.selectedDataId = "";
  }

  // 是否管控
  handleChange(docid, index, e) {
    if (e == true) {
      Object.assign(this.store.docTypes[index], {'ismc': '1'});
      Object.assign(this.store.docTypeList, this.store.docTypes[index]);
    }
    if (e == false) {
      Object.assign(this.store.docTypes[index], {'ismc': '0', 'isshare': '0'});
    }
  }

  // 是否共享下级
  handleCheck(docid, index) {
    this.setState({
      isChecked: !this.state.isChecked
    }, () => {
      if (this.store.docTypes[index].ismc == '1') {
        if (this.state.isChecked == true) {
          Object.assign(this.store.docTypes[index], {'isshare': '1'});
        }
        if (this.state.isChecked == false) {
          Object.assign(this.store.docTypes[index], {'isshare': '0'});
        }
      }
      else {
        return false;
      }
    });
  }

  // 保存
  handleSubmit() {
    let _this = this;
    const selData = _this.store.docTypes.slice();
    _this.store.paramData.docTypes = selData;

    _this.store.doSave()
    .then(data => {
      if (data.flag) {
        GlobalStore.showInfo("保存成功");
        _this.close();
        // 添加
        var dd = [];
        // 全部取消
        var tt = [];
        selData.map((item, index) => {
          if(item.ismc == '1') {
            dd.push(item.ismc);
          }
          if(item.ismc == '0') {
            tt.push(item.ismc);
          }
        });

        if(dd.length > 0) {
          _this.props.changeIcon();
        }
        if(tt.length == selData.length) {
          _this.props.addIcon();
        }
        _this.props.chanageIconData(_this.store.paramData);

      } else {
        GlobalStore.showError(data.msg);
      }
    });
  }

  render() {
    let _this = this;

    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close} className="manage-modal">
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>基础数据管理配置</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="manage-content">
              <table className="table">
                <thead>
                <tr>
                  <th colSpan={2}>管理范围</th>
                </tr>
                </thead>
              </table>
              <Scrollbars
                autoHeight
                autoHeightMax={220}>
                <table className="table" style={{'borderBottom':'none'}}>
                  <tbody>
                  {
                    this.store.docTypes.length > 0 ?
                      this.store.docTypes.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="manage-checkbox">
                                <Checkbox colors="dark"
                                          checked={item.ismc == '1' ? true : false}
                                          onChange={this.handleChange.bind(this, item.docid, index)}> {item.docname}</Checkbox>
                              </div>
                            </td>
                            <td>
                              <div className={this.store.docTypes[index].ismc=='1'?"manage-checkbox":'hidden'} onClick={this.handleCheck.bind(this, item.docid, index)}>
                                <div className={item.isshare == '1' ? "manage-radio-checked":"manage-radio"}></div>
                                <span>共享下级</span>
                              </div>
                            </td>
                          </tr>)
                      }) :
                      (<tr className="active">
                        <td colSpan={2} style={{'textAlign': 'center'}}>暂无数据</td>
                      </tr>) }
                  </tbody>
                </table>
              </Scrollbars>
            </div>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none'}}>
            <button className="btn btn-primary-red mr10" onClick={_this.handleSubmit}>保存</button>
            <button className="btn btn-default-red" onClick={_this.close}>取消</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ManageModal;