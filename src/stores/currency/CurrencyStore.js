/*
 * 币种store
 * dangwei@yonyou.com
 */
import fetch from 'isomorphic-fetch';
import {observable, computed, action, toJS} from 'mobx';

import Config from '../../config';
import GlobalStore from '../GlobalStore';

//解决浏览器缓存
function timestamp(url) {
    var getTimestamp = new Date().getTime();
    if (url.indexOf("?") > -1) {
        url = url + "×tamp=" + getTimestamp
    } else {
        url = url + "?timestamp=" + getTimestamp
    }
    return url;
}

class CurrencyStore {
    globalStore = GlobalStore;
    @observable
    currencys = [];
    @observable
    currency = {code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0};
    @observable
    tableDataTitle = '暂无数据';
    @observable
    pricerounts = [{'price': "5", name: "四舍五入"}, {'price': "0", name: "全部舍位"}, {'price': "1", name: "全部进位"}]; // 单价舍入规则
    @observable
    ListData = [];
    @observable
    page = 1;   // 页面切换
    @observable
    refJsonData = []; // 币种参照数据
    @observable
    searchValueKey = ''; // 模糊搜索查询key
    @observable
    moneyrount =  {};  // 默认金额进位
    @observable
    pricerount =  {}; // 默认单价进位
   

    // 查询接口
    @action
    getCurrencyLst() {
        this.globalStore.showWait();
        let opt = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
           credentials: "include"
        }

        return (
           // fetch('http://127.0.0.1/webCurrency/getBillType', opt)
            fetch(timestamp(Config.currency.query), opt)
                .then(response => {
                    this.globalStore.hideWait();
                    return response.ok ? response.json() : {}
                })
                .then(data => {
                    if (data.status) {
                        this.currencys.replace(data.data);
                        this.ListData.replace(data.data);
                    } else {
                        this.globalStore.showError(!data.msg ? "列表数据查询失败" : data.msg);
                    }
                }).catch(function (err) {
                this.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
            })
        )
    }


    // 新增、编辑接口
    @action
    handleSubmit(flag) {
        this.globalStore.showWait();
        let option = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(this.currency),
            credentials: "include"
        }
        if (flag === 'add') {
            //return fetch('http://127.0.0.1/webCurrency/getAddType', option)
            return fetch(Config.currency.add, option)
                .then(response => {
                    this.globalStore.hideWait();
                    return response.ok ? response.json() : {}
                })
                .then(data => data)
        }
        if (flag === 'edit') {
            //return fetch('http://127.0.0.1/webCurrency/getEditType', option)
            return fetch(Config.currency.edit, option)
                .then(response => {
                    this.globalStore.hideWait();
                    return response.ok ? response.json() : {}
                })
                .then(data => data)
        }
    }


    // 删除接口
    @action
    hdDelete(index, callback) {
        let _this = this;
        let params = {
            id: _this.currencys[index].id
        }

        let option = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(params),
            credentials: "include"
        }

        _this.globalStore.showWait();

        //return fetch('http://127.0.0.1/webCurrency/getDelType', option)
        return fetch(Config.currency.delete, option)
            .then(response => {
                _this.globalStore.hideWait();
                return response.ok ? response.json() : {}
            })
            .then(data => {
                if (data.status) {
                    callback();
                    GlobalStore.showInfo("删除成功")
                } else {
                    GlobalStore.showError(data.msg)
                }
            })
    }

    // 模糊查询接口
    @action
    handleSearch(param) {
        this.globalStore.showWait();
        let opt = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: "include"
        }

        //let url = encodeURI('http://127.0.0.1/webCurrency/getSearch?keyword='+param);
        let url = Config.currency.search + '?keyword=' + encodeURIComponent(param);

        return (
            fetch(url, opt)
                .then(response => {
                    this.globalStore.hideWait();
                    return response.ok ? response.json() : {}
                })
                .then(data => {
                    if (data.status) {
                        if (!data.data && typeof data.data != "undefined" && data.data != 0) {
                            this.currencys.replace([]);
                        } else {
                            this.currencys.replace(data.data);
                        }
                    }
                }).catch(function (err) {
                this.globalStore.hideWait();
                this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
            })
        )
    }

    // 设为默认接口
    @action
    hdDefault(index, callback) {
        let _this = this;

        let option = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(_this.currency),
            credentials: "include"
        }

        _this.globalStore.showWait();
        
        //return fetch('http://127.0.0.1/webCurrency/getDelType', option)
        return fetch(Config.currency.setDefault, option)
            .then(response => {
                _this.globalStore.hideWait();
                return response.ok ? response.json() : {}
            })
            .then(data => {
                if (data.status) {
                    callback();
                    GlobalStore.showInfo("设为默认成功")
                } else {
                    GlobalStore.showError(data.msg)
                }
            })
    }

    // 获取币种参照数据
    @action
    getRefData() {
        let option = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: "include"
        }

        //return fetch('http://127.0.0.1/webCurrency/getRefData', option)
        return fetch(Config.currency.currencyRef, option)
            .then(response => {
                return response.ok ? response.json() : {}
            })
            .then(data => {
                var oo = []
                data.data.map((item, index) => {
                    var li = {}
                    Object.assign(li, {"value": item.name, "label": item.code, "id": item.id, "sign": item.sign})
                    oo.push(li)
                })
                this.refJsonData.replace(oo);
            })
    }
}

export default CurrencyStore;

