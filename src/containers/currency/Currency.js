/*
 *  币种
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';

import GlobalStore from '../../stores/GlobalStore';
import CurrencyList from './CurrencyList';
import CurrencyStore from '../../stores/currency/CurrencyStore';

@observer
class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.store = new CurrencyStore();
        this.state = {
            isHasData: this.store.tableDataTitle,   // 列表没有数据时显示内容
            value: '',     // 模糊搜索value
            focus: false   // 模糊搜索focus
        }

        this.handleChange = this.handleChange.bind(this);
        this.inputOnBlur = this.inputOnBlur.bind(this);
        this.inputOnFocus = this.inputOnFocus.bind(this);
        this.handleRule = this.handleRule.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
    }

    componentDidMount() {
        //document.title="币种";
        // 初始化查询列表
        this.store.getCurrencyLst();
    }

    handleClear() {
        let _this = this;
        _this.setState({value: ''});
    }

    // 新增、编辑
    handleAdd(index, flag) {
        if (flag === 'add') {
            Object.assign(this.store.currency, {code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0});
            Object.assign(this.store.pricerount,{'price': "5", 'name': "四舍五入"})
            Object.assign(this.store.moneyrount,{'price': "5", 'name': "四舍五入"})
        }
        if (flag === 'edit') {
            Object.assign(this.store.currency, this.store.currencys[index]);

            // 单价进位
            if(this.store.currencys[index].pricerount==5) {
                Object.assign(this.store.pricerount,{'price': "5", name: "四舍五入"})
            }
            if(this.store.currencys[index].pricerount==1) {
                Object.assign(this.store.pricerount,{'price': "1", name: "全部进位"})
            }
            if(this.store.currencys[index].pricerount==0) {
                Object.assign(this.store.pricerount,{'price': "0", name: "全部舍位"})
            }

            // 金额进位
            if(this.store.currencys[index].moneyrount==5) {
                Object.assign(this.store.moneyrount,{'price': "5", name: "四舍五入"})
            }
            if(this.store.currencys[index].moneyrount==1) {
                Object.assign(this.store.moneyrount,{'price': "1", name: "全部进位"})
            }
            if(this.store.currencys[index].moneyrount==0) {
                Object.assign(this.store.moneyrount,{'price': "0", name: "全部舍位"})
            }

        }
       
        this.refs.card.show({index, store: this.store, flag});
        this.store.page = 2;
    }

    // 删除
    handleDelete(index) {
        GlobalStore.showCancelModel('确定要删除这条信息吗？', () => {
        }, this.store.hdDelete.bind(this.store, index, () => {
            if (this.store.searchValueKey != '') {
                this.store.handleSearch($.trim(this.store.searchValueKey));
            } else {
                this.store.getCurrencyLst();
            }
        }));
    }

    // 设为默认
    handleDefault(index, e) {
        e.preventDefault();
        let _this = this;
        Object.assign(this.store.currency, this.store.currencys[index]);
        GlobalStore.showCancelModel('确定设为默认？', () => {
        }, _this.store.hdDefault.bind(_this.store, index, () => {
            _this.store.getCurrencyLst();
        }));
    }

    // 模糊搜索
    handleChangeSearch(e) {
        e.preventDefault();
        let val = this.state.value;
        const str = val.toString();
        this.store.searchValueKey = str;
        this.store.handleSearch($.trim(str));
    }

    // 获得焦点
    inputOnFocus() {
        this.setState({focus: true});
    }

    // 失去焦点
    inputOnBlur() {
        this.setState({focus: false});
    }

    // 文本框变化事件
    handleChange(e) {
        e.preventDefault();
        this.setState({value: e.target.value});
    }

    // 回车事件
    handleKeydown(event) {
        if (event.keyCode == 13) {
            this.handleChangeSearch(event);
        }
    }

    // 前端转换规则
    handleRule(param) {
        switch (param) {
            case 0:
                return param = '全部舍位';
                break;
            case 1:
                return param = '全部进位';
                break;
            default:
                return param = '四舍五入';
        }
    }


    render() {
        return (
            <div className="container-fluid" style={{'paddingBottom':'30px'}}>
                <div className={this.store.page == 1 ? 'database-container' :'hidden'}>
                    <div className="head">
                        <div className="head-l fl">
                            <div className="currency-input">
                                <input type="text"
                                       className="form-control"
                                       placeholder="请输入搜索内容"
                                       onBlur={ ::this.inputOnBlur }
                                       onFocus={ ::this.inputOnFocus }
                                       onChange={this.handleChange}
                                       onKeyDown={this.handleKeydown}
                                       value={this.state.value}/>
                                <span className="cl cl-search search-icon" onClick={this.handleChangeSearch}></span>
                            </div>
                        </div>
                        <div className="head-r fr">
                            <button className="btn btn-primary" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
                        </div>
                    </div>

                    <div className="currency-grid">
                        <table className="table">
                            <thead>
                            <tr>
                                <th style={{'width':'11.5%'}}>币种</th>
                                <th style={{'width':'11.5%'}}>币种简称</th>
                                <th style={{'width':'11.5%'}}>币种符号</th>
                                <th style={{'width':'11.5%'}}>单价精度</th>
                                <th style={{'width':'11.5%'}}>金额精度</th>
                                <th style={{'width':'11.5%'}}>单价进价</th>
                                <th style={{'width':'11.5%'}}>金额进价</th>
                                <th style={{'width':'19.5%'}}>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.store.currencys.length > 0 ?
                                    this.store.currencys.map((value, index) =>
                                        (<tr key={index}>
                                            <td title={value.code}>{value.code}</td>
                                            <td title={value.name}>{value.name}</td>
                                            <td title={value.sign}>{value.sign}</td>
                                            <td title={value.pricedigit}>{value.pricedigit}</td>
                                            <td title={value.moneydigit}>{value.moneydigit}</td>
                                            <td title={this.handleRule(value.pricerount)}>{this.handleRule(value.pricerount)}</td>
                                            <td title={this.handleRule(value.moneyrount)}>{this.handleRule(value.moneyrount)}</td>
                                            <td>
                                                <button className="btn btn-operate mr10" onClick={this.handleDelete.bind(this, index)}>删除</button>
                                                <button className="btn btn-operate mr10" onClick={this.handleAdd.bind(this, index, 'edit')}>编辑</button>
                                                {
                                                    /*value.isdefault==1 ? '': <button className="btn btn-operate" onClick={this.handleDefault.bind(this, index)}>设为默认</button>*/
                                                }
                                            </td>
                                        </tr>)
                                    )
                                    : (<tr>
                                    <td colSpan="8" style={{textAlign:"center"}}>{this.state.isHasData}</td>
                                </tr>)
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={this.store.page == 2 ? '':'hidden'}>
                    <CurrencyList ref="card" store={this.store} handleClear={this.handleClear.bind(this)}/>
                </div>

            </div>
        )
    }
}

export default Currency;
