/*
 * 定义自定义项 查看更多弹框组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';

import GlobalStore from '../../stores/GlobalStore';
import CustomStore from '../../stores/custom/CustomStore';
let title = {'add': '新增', 'edit': '编辑'}

@observer
class StaffAddModal extends Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isShow: false,
      viewMoreData: []
    }

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // 打开
  show(param) {
    this.setState({
      isShow: true,
      flag: param.flag
    });
    //console.log('编辑', param)
    //console.log('编辑', this.props.id)
    if(param.flag == 'add') {
      Object.assign(this.store.staffViewSaveData,{'parentid':this.props.id,'name':'','doctype':'','extendStatus':1})
    }
    if(param.flag == 'edit') {
      Object.assign(this.store.staffViewSaveData,{'parentid':this.props.id,'name':param.name,'doctype':param.doctype,'extendStatus':1})
      this.store.selectedEditId = param.id;
    }
  }

  // 关闭
  close() {
    this.setState({
      isShow: false
    });
    Object.assign(this.store.staffViewSaveData, {'parentid': '', 'name': '', 'doctype': ''});
  }


  // 改变输入框
  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    this.refs[field].innerHTML = '';
    this.store.staffViewSaveData[field] = val;
    if(field=='name') {
      let reg = /^[\-0-9a-zA-Z_\u4e00-\u9fff]{1,}$/;
      if(!reg.test($.trim(val))) {
        this.refs[field].innerHTML = '100位以内的中文、字母、数字、下划线、短横';
      }
    }
    if(field=='doctype') {
      let reg = /^[0-9a-zA-Z_\-]{1,}$/;
      if(!reg.test($.trim(val))) {
        this.refs[field].innerHTML = '字母、数字、下划线、短横';
      }
    }
  }

  // 保存
  onSubmit(event) {
    event.preventDefault();

    if(this.store.staffViewSaveData.name=='') {
      this.refs.name.innerHTML = "档案名称不能为空！";
      return false;
    }

    if(this.store.staffViewSaveData.doctype=='') {
      this.refs.doctype.innerHTML = "档案编码不能为空！";
      return false;
    }

    if(this.state.flag == 'add') {
      // 校验
      let queryViewMore = this.props.queryViewMoreData.slice();
      for (var i = 0, len = queryViewMore.length; i < len; i++) {
        var val = this.store.staffViewSaveData.name;
        var type =  this.store.staffViewSaveData.doctype;
        if (queryViewMore[i].name == val) {
          this.refs.name.innerHTML = "档案名称已存在！";
          return false;
        }
        if (queryViewMore[i].doctype == type) {
          this.refs.doctype.innerHTML = "档案编码已存在！";
          return false;
        }
      }
    }


    this.store.viewMoreSave(this.state.flag)
      .then(data => {
        if (data.status) {
          GlobalStore.showInfo("保存成功");
          const saveData = JSON.stringify(this.store.staffViewSaveData);
          const flag = this.state.flag;
          this.props.addData({saveData,flag});
          this.close();
        } else {
          GlobalStore.showError(data.data);
        }
      });
  }
  
  render() {
    let _this = this;
    const staffViewSaveData = _this.store.staffViewSaveData;

    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close} className="manage-modal">
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>{title[this.state.flag]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="currency-form">
              <FormGroup className="custom-formgroup" controlId="name">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={3} sm={3} xs={3}>
                  名称：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <div className="pr" style={{'width':'260px'}}>
                    <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="名称"
                                 value={staffViewSaveData.name}
                                 onChange={_this.handleChange.bind(this, 'name')}
                    />
                    <div ref="name" style={{'top':'40px','left':'0'}} className="currency-error"></div>
                  </div>
                </Col>
              </FormGroup>

              <FormGroup className="custom-formgroup" controlId="doctype">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={3} sm={3} xs={3}>
                  编码：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <div className="pr" style={{'width':'260px'}}>
                    <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="编码"
                                 value={staffViewSaveData.doctype}
                                 onChange={_this.handleChange.bind(this, 'doctype')}
                    />
                    <div ref="doctype" style={{'top':'40px','left':'0'}} className="currency-error"></div>
                  </div>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none','marginBottom':'20px'}}>
            <button className="btn btn-default-red mr15" onClick={_this.close}>取消</button>
            <button className="btn btn-primary-red mr30" onClick={_this.onSubmit}>保存</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default StaffAddModal;

