/*
 * 定义自定义项 新增、编辑组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import DatePicker  from "react-datepicker";
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import GlobalStore from '../../stores/GlobalStore';

let title = {'add': '添加自定义', 'edit': '编辑自定义'}

@observer
class CustomListAddOrEdit extends Component {
  constructor(props) {
    super(props)
    this.store = props.store;
    this.state = {
      value: '',
      index: -1,
      validation: {
        name: null
      },
      startDate: moment(),  // 创建时间
      endDate: moment(),    // 最后修改时间
      clearable: false,
      searchable: false,
      selectOneValue: this.store.datatypeVale,   // 默认选择的数据类型
      selectTwoValue: this.store.instancefileValue, // 默认选择的引用档案
    }

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.store.queryEntitiy();
  }

  // 展示
  show(param) {
    let {index, flag} = param;
    this.setState({
      flag,
      index: index,
      validation: {
        pricedigit: null,
        moneydigit: null
      },
      selectOneValue: this.store.datatypeVale,
      selectTwoValue: this.store.instancefileValue,
      startDate: moment(),
      endDate: moment()
    });
  }

  // 日期事件
  handleChangeDate(param, date) {
    if (param == 'startData') {
      this.setState({
        startDate: date
      });
      this.store.custom.creationtime = date;
    }

    if (param == 'endData') {
      this.setState({
        endDate: date
      });
      this.store.custom.modifiedtime = date;
    }
  }

  // 取消
  close() {
    this.store.page = 1;
    if(this.refs.name) {this.refs.name.innerHTML = '';}
    if(this.refs.attrlength) {this.refs.attrlength.innerHTML = '';}
    if(this.refs.attrprecision) {this.refs.attrprecision.innerHTML = '';}

    if (this.state.page == 'add') {
      Object.assign(this.store.custom,{"name":"","type":"","doctype":"","reftype":"","attrlength":"256","attrprecision":"0","creator":"","creationtime":"","modifier":"","modifiedtime":""});
      this.store.precisionNULL = true;
      this.store.lengthNull = false;
      this.setState({selectOneValue: this.store.datatypeVale, selectTwoValue: this.store.instancefileValue});
    }

    if (this.state.flag == 'edit') {
      this.setState({selectOneValue: this.store.datatypeVale, selectTwoValue: this.store.instancefileValue});
    }
  }

  // 数据类型、引用档案 枚举
  updateChangeValue(field, value) {
    if (field == 'type') {
      this.setState({selectOneValue: value});
      this.props.onChangeType(value.code);
      this.store.custom[field] = value.code;
    }
    if (field == 'reftype') {
      this.setState({selectTwoValue: value});
      this.store.custom[field] = value.code;
    }
  }

  // change事件
  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;

    if(field == 'name') {
      this.refs[field].innerHTML = '';
      this.setState(Object.assign(this.state.validation, {name: null}))
    }

    // 输入长度、精度
    if (field == 'attrprecision' || field == 'attrlength') {
      this.refs[field].innerHTML = '';
      var _val = "";
      if (isNaN(val)) {
        val = _val;
        this.refs[field].innerHTML = '只能输入数字!';
      } else {
        val = val.replace(/\s+/g, '');
        var reg = new RegExp(/[0-9]/g)
        if (!reg.test(val)) {
          _val = val;
        }
      }
    }

    this.store.custom[field] = val;
  }

  // 输入长度、精度 blur事件
  handleBlur(field, e) {
    e.preventDefault();
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    if (val == '') {
      this.refs[field].innerHTML = '';
    }
  }

  // 保存
  onSubmit(event) {
    event.preventDefault();

    // 保存校验
    if (this.store.custom.name == '') {
      this.refs.name.innerHTML = '名称不能为空！';
      this.setState(Object.assign(this.state.validation, {name: 'error'}))
      return false;
    }

    this.store.handleSubmit(this.state.flag)
      .then(data => {
        if (data.status) {
          GlobalStore.showInfo("保存成功");
          if (this.state.flag == 'add') {
            this.props.handlePagination(1, event);
          } else {
            this.props.handlePagination(this.store.activePageSize, event);
          }
          this.close();
        } else {
          GlobalStore.showError(data.msg);
        }
      });
  }


  render() {
    let custom = this.store.custom;

    return (
      <div className="database-container">
        <div className="head">
          <div className="head-r fr">
            <button className="btn btn-default mr15" onClick={this.close}>取消</button>
            <button className="btn btn-primary mr10" onClick={this.onSubmit}>保存</button>
          </div>
        </div>
        <div className="currency-content" style={{'paddingBottom':'150px'}}>
          <div className="currency-title">
            {title[this.state.flag]}
          </div>
          <Form inline className="currency-form">
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="name" validationState={this.state.validation.name}>
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} xs={4}>
                  <span className="currency-bishu">*</span>名称：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <div className="pr" style={{'width':'260px'}}>
                    <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="名称"
                                 value={custom.name} onChange={this.handleChange.bind(this, 'name')}/>
                    <div ref="name" style={{'top':'38px','left':'0'}} className="currency-error"></div>
                  </div>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="attrlength">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} xs={4}>
                  输入长度：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  {this.store.lengthNull == true ?
                    <div className="pr" style={{'width':'260px'}}>
                      <FormControl readOnly="readOnly" autoComplete='off' className="currency-ref" type="text"
                                   placeholder="输入长度" value={custom.attrlength}
                                   onChange={this.handleChange.bind(this, 'attrlength')}/>
                      <div ref="attrlength" style={{'top':'38px','left':'0'}} className="currency-error"></div>
                    </div>
                    :
                    <div className="pr" style={{'width':'260px'}}>
                      <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="输入长度"
                                   value={custom.attrlength}
                                   onBlur={this.handleBlur.bind(this, 'attrlength')}
                                   onChange={this.handleChange.bind(this, 'attrlength')}/>
                      <div ref="attrlength" style={{'top':'38px','left':'0'}} className="currency-error"></div>
                    </div>
                  }
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="type">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} xs={4}>
                  数据类型：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <Select
                    className="currency-ref"
                    name="form-field-name"
                    value={this.state.selectOneValue}
                    onChange={this.updateChangeValue.bind(this, 'type')}
                    options={this.store.dataTypes}
                    clearable={this.state.clearable}
                    searchable={this.state.searchable}
                    valueKey="code"
                    labelKey="name"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12} xs={12} className="custom-m30">
              {this.store.precisionNULL == true ? '' :
                <FormGroup className="custom-formgroup" controlId="attrprecision">
                  <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} xs={4}>
                    精度：
                  </Col>
                  <Col md={6} sm={6} xs={6}>
                    <div className="pr" style={{'width':'260px'}}>
                      <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="精度"
                                   value={custom.attrprecision}
                                   onBlur={this.handleBlur.bind(this, 'attrprecision')}
                                   onChange={this.handleChange.bind(this, 'attrprecision')}/>
                      <div ref="attrprecision" style={{'top':'38px','left':'0'}} className="currency-error"></div>
                    </div>
                  </Col>
                </FormGroup>
              }
            </Col>
          </Form>

          <Form inline className="currency-form custom-doctype">
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="reftype">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} xs={4}>
                  引用档案：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <Select
                    className="currency-ref"
                    name="form-field-name"
                    value={this.state.selectTwoValue}
                    onChange={this.updateChangeValue.bind(this, 'reftype')}
                    options={this.store.instanceFiles}
                    clearable={this.state.clearable}
                    searchable={this.state.searchable}
                    valueKey="code"
                    labelKey="name"
                  />
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="creator">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} xs={4}>
                  创建人：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  {this.state.flag == 'edit' ?
                    <FormControl readOnly="readOnly" className="currency-ref" type="text" placeholder="创建人"
                                 value={custom.creator}
                                 onChange={this.handleChange.bind(this, 'creator')}/>
                    : <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="创建人"
                                   value={custom.creator}
                                   onChange={this.handleChange.bind(this, 'creator')}/>
                  }
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="modifier">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} xs={4}>
                  最后修改人：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  {this.state.flag == 'edit' ?
                    <FormControl readOnly="readOnly" className="currency-ref" type="text" placeholder="最后修改人"
                                 value={custom.modifier} onChange={this.handleChange.bind(this, 'modifier')}/>
                    : <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="最后修改人"
                                   value={custom.modifier} onChange={this.handleChange.bind(this, 'modifier')}/>
                  }
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} xs={4}>
                  创建时间：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  {this.state.flag == 'edit' ?
                    <FormControl readOnly="readOnly" className="currency-ref" type="text" value={custom.creationtime}/>
                    : <div className="v-table-inputdate">
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChangeDate.bind(this, 'startData')}
                      locale="zh-CN"
                      dateFormat="YYYY-MM-DD"
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      todayButton={"今天"}
                      className="form-control currency-ref"
                      minDate={moment()}
                    />
                  </div>}
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12} xs={12} className="custom-m30">
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} xs={4}>
                  最后修改时间：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  {this.state.flag == 'edit' ?
                    <FormControl readOnly="readOnly" className="currency-ref" type="text" value={custom.modifiedtime}/>
                    : <div className="v-table-inputdate">
                    <DatePicker
                      selected={this.state.endDate}
                      onChange={this.handleChangeDate.bind(this, 'endData')}
                      locale="zh-CN"
                      dateFormat="YYYY-MM-DD"
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      todayButton={"今天"}
                      className="form-control currency-ref"
                      minDate={moment()}
                    />
                  </div>}
                </Col>
              </FormGroup>
            </Col>
          </Form>
        </div>
      </div>
    )
  }
}

export default CustomListAddOrEdit;
