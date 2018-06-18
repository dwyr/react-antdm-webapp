/*
 * 币种卡片
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';

import {Modal, Form, FormGroup, FormControl, Grid, Row, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import GlobalStore from '../../stores/GlobalStore';

let title = {'add': '添加币种', 'edit': '编辑币种'}

@observer
export default class CurrencyList extends Component {
    static propTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.store = props.store;
        this.state = {
            value: '',
            index: -1,
            validation: {
                pricedigit: null,
                moneydigit: null
            },
            searchable: false,  // select是否搜索
            clearable: false,   // select是否清楚
            selectValue: this.store.currency.code,  // 币种参照的value
            selectOneValue: this.store.pricerount,  // 单价进价的value
            selectTwoValue: this.store.moneyrount,  // 金额进价的value
        }

    }

    componentDidMount() {
        this.store.getRefData();
    }

    // 取消
    close() {
        this.store.page = 1;
        if (this.state.flag == 'add') {
            Object.assign(this.store.currency,{code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0});
            this.setState({selectValue:' ',selectOneValue:this.store.pricerount,selectTwoValue: this.store.moneyrount})
        }
        if (this.state.flag == 'edit') {
            this.setState({selectOneValue:this.store.pricerount,selectTwoValue: this.store.moneyrount})
        }
        this.refs.message.innerHTML = '';
        this.refs.pricedigit.innerHTML = '';
        this.refs.moneydigit.innerHTML = '';
    }

    // 文本框改变
    handleChange(field, e) {
        let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
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
        this.store.currency[field] = val;
        if (field == 'pricedigit') {
            this.setState(Object.assign(this.state.validation, {pricedigit: null}))
        }
        else {
            this.setState(Object.assign(this.state.validation, {moneydigit: null}))
        }
    }

    // 卡片展示
    show(param) {
        let {index, flag} = param;
        this.setState({
            flag, index: index, validation: {
                pricedigit: null,
                moneydigit: null
            }
        })
    }


    // 保存提交
    handleSubmit() {
        if (this.state.flag == 'add') {
            // 币种数据校验
            for (var i = 0, len = this.store.ListData.length; i < len; i++) {
                var val = this.store.currency.code;
                if (this.store.ListData[i].code == val) {
                    this.refs.message.innerHTML = "币种已存在！";
                    return false;
                }
            }
        }

        if (this.store.currency.code == '') {
            this.refs.message.innerHTML = '币种不能为空！';
        }
        if (this.store.currency.pricedigit == '') {
            this.refs.pricedigit.innerHTML = '单价精度不能为空！';
            this.setState(Object.assign(this.state.validation, {pricedigit: 'error'}))
        }
        if (this.store.currency.moneydigit == '') {
            this.refs.moneydigit.innerHTML = '金额精度不能为空！';
            this.setState(Object.assign(this.state.validation, {moneydigit: 'error'}))
        }
        if (this.store.currency.moneydigit == '' || this.store.currency.pricedigit == '' || this.store.currency.code == '') {
            return false;
        }


        this.store.handleSubmit(this.state.flag)
            .then(data =>{
                if (data.status) {
                    GlobalStore.showInfo("保存成功");
                    if(this.state.flag =='add') {
                        this.store.searchValueKey = ' ';
                        this.store.getCurrencyLst();
                        this.props.handleClear();
                    } else {
                        if(this.store.searchValueKey != '') {
                            this.store.handleSearch($.trim(this.store.searchValueKey));
                        } else {
                            this.store.getCurrencyLst();
                        }
                    }
                    this.close();
                } else {
                    GlobalStore.showError(data.msg);
                }
            });
    }


    // 币种参照的code name展示
    _renderMenuItemChildren(option, props, index) {
        return [<span key="code">{option.label + " "}</span>, <strong key="name">{option.value} </strong>];
    }

    // 币种参照
    updateValue (newValue) {
        console.log(newValue)
        this.setState({
            selectValue: newValue,
        });
        Object.assign(this.store.currency, {id: newValue.id, code: newValue.label,name: newValue.value,sign:newValue.sign})
        this.refs.message.innerHTML = " ";
        // 数据校验
        this.store.ListData.map((value, index) => {
            let val = this.store.currency.code;
            if (value.code == val) {
                this.refs.message.innerHTML = "币种已存在！";
                return;
            }
        });
    }

    // 单价、金额枚举
    updateChangeValue(field, value) {
        this.store.currency[field] = Number(value.price);
        if(field=='pricerount') {
            this.setState({selectOneValue:value})
        }
        if(field=='moneyrount') {
            this.setState({selectTwoValue:value})
        }
    }

    // 描述文本框
    handleDesc(field, e) {
      let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
      this.store.currency[field] = val;
    }

    render() {
        let currency = this.store.currency;
        
        return (
            <div className="database-container">
                <div className="head">
                    <div className="head-r fr">
                        <button className="btn btn-default mr15" onClick={this.close.bind(this)}>取消</button>
                        <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>保存</button>
                    </div>
                </div>
                <div className="currency-content container-fluid">
                    <div className="currency-title">
                        {title[this.state.flag]}
                    </div>

                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="code">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>币种:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        {
                                            (this.state.flag === 'edit') ?
                                                <FormControl type="text" placeholder="币种"
                                                             value={currency.code}
                                                             readOnly={true}
                                                             style={{'width':'260px'}}
                                                />
                                                :
                                                <Select
                                                    className="currency-ref"
                                                    placeholder="请选择..."
                                                    noResultsText="无匹配"
                                                    name="form-field-name"
                                                    value={this.state.selectValue}
                                                    onChange={this.updateValue.bind(this)}
                                                    options={this.store.refJsonData}
                                                    clearable={false}
                                                    deleteRemoves={false}
                                                    backspaceRemoves={false}
                                                    optionRenderer={this._renderMenuItemChildren.bind(this)}
                                                />
                                        }
                                        <div ref="message" className="currency-error"></div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="category">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    币种简称:
                                </Col>
                                <Col xs={6}>
                                    <FormControl type="text" placeholder="币种简称"
                                                 value={currency.name}
                                                 readOnly={true}
                                                 style={{'width':'260px'}}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form" style={{'paddingBottom':'55px'}}>
                        <Col xs={6} style={{'display': 'block'}}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="category">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    币种符号:
                                </Col>
                                <Col xs={6}>
                                    <FormControl type="text" placeholder=" 币种符号"
                                                 value={currency.sign}
                                                 readOnly={true}
                                                 style={{'width':'260px'}}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form currency-border clearfix">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '20px'}} controlId="pricedigit"
                                       validationState={this.state.validation.pricedigit}>
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>单价精度:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        <input type="text"
                                               placeholder="单价精度"
                                               value={currency.pricedigit}
                                               className="form-control"
                                               autoComplete="off"
                                               onChange={this.handleChange.bind(this, "pricedigit")}
                                               style={{'width':'260px'}}
                                               maxLength="1"
                                        />
                                        <div ref="pricedigit" style={{'top':'36px','left':'0'}}
                                             className="currency-error"></div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md={6} sm={12} xs={12} className="currency-left">
                            <FormGroup style={{"width":'100%','marginBottom': '20px'}} controlId="pricerount">
                                <Col md={4} sm={3} xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    单价进价:
                                </Col>
                                <Col md={4} sm={6} xs={6}>
                                    <Select
                                        className="currency-ref"
                                        name="form-field-name"
                                        value={this.state.selectOneValue}
                                        onChange={this.updateChangeValue.bind(this, 'pricerount')}
                                        options={this.store.pricerounts}
                                        clearable={this.state.clearable}
                                        valueKey="price"
                                        labelKey="name"
                                        searchable = {this.state.searchable}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="moneydigit"
                                       validationState={this.state.validation.moneydigit}>
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>金额精度:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        <input type="text"
                                               placeholder="金额精度"
                                               value={currency.moneydigit}
                                               className="form-control"
                                               autoComplete="off"
                                               onChange={this.handleChange.bind(this, "moneydigit")}
                                               style={{'width':'260px'}}
                                               maxLength="1"
                                        />
                                        <div ref="moneydigit" style={{'top':'36px','left':'0'}}
                                             className="currency-error"></div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col md={6} sm={12} xs={12} className="currency-left">
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="moneyrount">
                                <Col md={4} sm={3} xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    金额进价:
                                </Col>
                                <Col md={4} sm={6} xs={6}>
                                   <Select
                                     className="currency-ref"
                                     name="form-field-name"
                                     value={this.state.selectTwoValue}
                                     onChange={this.updateChangeValue.bind(this, 'moneyrount')}
                                     options={this.store.pricerounts}
                                     clearable={this.state.clearable}
                                     valueKey="price"
                                     labelKey="name"
                                     searchable = {this.state.searchable}
                                   />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="description">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    备注:
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6} className="col-xs-pull-3">
                            <FormControl style={{'width':'100%'}} onChange={this.handleDesc.bind(this, "description")}
                                         value={currency.description}
                                         componentClass="textarea"
                            />
                        </Col>
                    </Form>

                </div>
            </div>
        );
    }
}
