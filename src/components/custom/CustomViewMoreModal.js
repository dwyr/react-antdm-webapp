/*
 * 定义自定义项 查看更多弹框组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import {Link} from 'react-router';
import {Scrollbars} from 'react-custom-scrollbars';

import StaffAddModal from '../../components/custom/StaffAddModal';
import CustomStore from '../../stores/custom/CustomStore';


@observer
class CustomViewMoreModal extends Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isShow: false,   // 弹框是否显示
      extendFlag: 0,   // 加号是否显示
      id:'',           // 当前数据的id
      name:'',        // 当前数据的name字段
    }

    this.close = this.close.bind(this);
    this.addData = this.addData.bind(this);
  }

  // 打开
  show(param) {
    this.setState({
      isShow: true,
      extendFlag: param.extendFlag,
      id: param.id,
      name: param.name
    });
    this.store.queryViewMoreData = param.param;
  }

  // 关闭
  close() {
    this.setState({
      isShow: false
    });
    this.props.refreshPage();
  }

  // 新增、编辑
  handleAdd(flag, index) {
    this.setState({isShow: false});
    if(flag=='add') {this.refs.staffAdd.show({flag})}
    if(flag=='edit') {
      const queryViewMoreData = this.store.queryViewMoreData.slice()[index];
      Object.assign(this.store.selectedEditData, queryViewMoreData);
      this.store.selectedEditIndex = index;
      this.refs.staffAdd.show({'name':queryViewMoreData.name,'doctype':queryViewMoreData.doctype,'id':queryViewMoreData.id,flag})}
  }

  // 拼接数据
  addData(param) {
    const addData = JSON.parse(param.saveData);
    this.setState({isShow: true});
    // 新增
    if(param.flag == 'add') {
      this.store.queryViewMoreData.push(addData);
    }
    // 编辑
    if(param.flag == 'edit') {
      //const selectedEditData = this.store.selectedEditData;
      // const index = this.store.queryViewMoreData.slice().findIndex(function(value,index) {
      //   return value.id == selectedEditData.id
      // });
      this.store.queryViewMoreData.splice(this.store.selectedEditIndex, 1, addData);
    }
  }


  render() {
    let _this = this;
    const queryViewMoreData = _this.store.queryViewMoreData.slice();
    
    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close} className="viewmore-modal manage-modal">
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>{_this.state.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Scrollbars
              universal={true}
              autoHeight
              autoHeightMax={350}>
                <div className="row clearfix" style={{'height':'350px'}}>
                  {queryViewMoreData.map((item, index) => {
                    return (<div key={'view'+index} className={item.extendStatus == 0 ?"viewmore":"viewmore-green"}>
                      <span onClick={_this.handleAdd.bind(this, 'edit', index)} className={item.extendStatus == 0 ? 'cl cl-pen viewmore-eidticon':'cl cl-pen viewmore-green-eidticon'}></span>
                      <Link to={"/customlist/"+item.doctype}>{item.name}</Link>
                    </div>)
                  })}
                  {_this.state.extendFlag == 0 ? <div className="custom-add" onClick={_this.handleAdd.bind(this, 'add')}></div>:''}
                </div>
              </Scrollbars>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none'}}>
            <button className="btn btn-default-red mr30" onClick={_this.close}>取消</button>
          </Modal.Footer>
        </Modal>

        <StaffAddModal
          ref='staffAdd'
          id={_this.state.id}
          addData={_this.addData}
          queryViewMoreData={_this.store.queryViewMoreData}
        />

      </div>
    )
  }
}


export default CustomViewMoreModal;
