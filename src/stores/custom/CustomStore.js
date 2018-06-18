/*
 * 定义自定义store
 * dangwei@yonyou.com
 */
import fetch from 'isomorphic-fetch';
import {observable, computed, action, toJS} from 'mobx';
import moment from 'moment';

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


class CustomStore {
  globalStore = GlobalStore;
  @observable
  customs = [];
  @observable
  custom = {"name":"","type":"","reftype":"","attrlength":"","attrprecision":"","creator":"","creationtime":"","modifier":"","modifiedtime":moment().format("YYYY-MM-DD HH:mm:ss")};
  @observable
  tableDataTitle = '暂无数据';
  @observable
  page = 1;     // 显示当前页
  @observable
  dataTypes = [{'code':'1','name':'字符串'},{'code':'4','name':'整数'},{'code':'31','name':'数值'},{'code':'32','name':'布尔类型'},{'code':'33','name':'日期'},{'code':'34','name':'日期时间'},{'code':'201','name':'自定义档案'},{'code':'201','name':'基本档案'}]; // 数据类型
  @observable
  datatypeVale = {'code': '1', 'name': '字符串'};  // 数据类型的默认value
  @observable
  pageNumber = 10;    // 每一页显示的数据条数
  @observable
  activePageSize = 1; // 记录当前显示的页码数
  @observable
  docustoms = [];     // 自定义项目数据
  @observable
  precisionNULL = false; // 记录数据类型联动时精度为零的记录
  @observable
  lengthNull = false;   // 记录输入长度的不可编辑状态
  @observable
  instanceFiles = [{'code':'adminorg','name':'行政组织'},{'code':'staff','name':'员工'},{'code':'supplier','name':'供应商'},{'code':'supplierbkAccount','name':'供应商银行账号'},{'code':'customer','name':'客户'},{'code':'customerbkAccount','name':'客户银行账号'},{'code':'materials','name':'物料'},{'code':'project','name':'项目'}]; // 引用档案
  @observable
  instancefileValue = {'code': 'adminorg', 'name': '行政组织'};  // 引用档案的默认value
  @observable
  defaultDoctype = '';  // 默认的doctype
  @observable
  queryViewMoreData = []; // 员工查看更多数据
  @observable
  extendFlag = 0;  // 员工查看更多是否显示  0: 显示 ， 1: 隐藏
  @observable
  staffViewSaveData = {'parentid':'','name':'','doctype':'','extendStatus':1};  // 员工档案新增保存数据
  @observable
  queryEntitiyData = [];  // 引用档案数据
  @observable
  selectedEditData = {}; // 记录档案选中编辑的数据
  @observable
  selectedEditId='';// 记录编辑的id
  @observable
  selectedEditIndex = ''; // 记录编辑的index
  


  // 查询所有的自定义项目 接口
  @action
  getDocs() {
    let _this = this;
    _this.globalStore.showWait();

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'mode': "no-cors",
        'tenantId': 'owzp1n95',                        // 查询接口使用
        'sysId': 'all',                                // 查询接口使用
      },
      credentials: "include"
    }

    return (
      fetch(timestamp(Config.custom.queryDocs), opt)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => {
        if (data.status) {

          data.data.map((item, index) => {
            if (item.doctype == 'adminorg') {
              Object.assign(item, {'src': './images/xingzhengzuzhi.png'});
            }
            if (item.doctype == 'customer') {
              Object.assign(item, {'src': './images/kehu.png',});
            }
            if (item.doctype == 'materials') {
              Object.assign(item, {'src': './images/wuliao.png',});
            }
            if (item.doctype == 'project') {
              Object.assign(item, {'src': './images/xiangmu.png'});
            }
            if (item.doctype == 'staff') {
              Object.assign(item, {'src': './images/yuangong.png'});
            }
            if (item.doctype == 'supplier') {
              Object.assign(item, {'src': './images/gongyingsahng.png'});
            }
          });

          _this.docustoms.replace(data.data);
        }
        else {
          _this.globalStore.showError(!data.msg ? "数据查询失败" : data.msg);
        }
      }).catch(function (err) {
        _this.globalStore.hideWait();
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }

  // 查询接口
  @action
  getCustomList(data, callback) {
    let _this = this;
    _this.globalStore.showWait();

    let param = {
      "orders": [{"direction": "ASC", "property": "code"}],
      "conditions": [{
        "conditionList": [],
        "datatype": "string",
        "extendSql": {},
        "field": "doctype",
        "logic": false,
        "logicsymbol": "and",
        "operator": "=",
        "value": data.queryType
      }],
      "pageIndex": data.startIndex,
      "pageSize": data.itemPerPage
    };

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'mode': "no-cors",
        'tenantId': 'owzp1n95',                        // 查询接口使用
      },
      body: JSON.stringify(param),
      credentials: "include"
    }

    return (
      fetch(timestamp(Config.custom.query), opt)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => {
        if (data.status) {
          _this.customs.replace(data.data.content);
          callback(data.data);
        }
        else {
          _this.globalStore.showError(!data.msg ? "列表数据查询失败" : data.msg);
        }
      }).catch(function (err) {
        _this.globalStore.hideWait();
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }

  // 新增、编辑接口
  @action
  handleSubmit(flag) {
    let _this = this;
    this.globalStore.showWait();

    if (flag === 'add') {
      let option = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'userId': '2c179f11b41643fcb61508d86b798910',  // 新增接口使用
          'tenantId': 'owzp1n95',                        // 新增接口使用
          'sysId': 'all',                                // 新增接口使用
        },
        body: JSON.stringify(this.custom),
        credentials: "include"
      }


      return fetch(Config.custom.add, option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
    }

    if (flag === 'edit') {
      let option = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'userId': '2c179f11b41643fcb61508d86b798910',  // 新增接口使用
          'tenantId': 'owzp1n95',                        // 新增接口使用
          'sysId': 'all',                                // 新增接口使用
        },
        body: JSON.stringify(this.custom),
        credentials: "include"
      }

      return fetch(Config.custom.edit + `${this.custom.id}` + '?tenantId=owzp1n95', option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
    }
  }

  // 删除接口
  @action
  handleDelete(index, callback) {
    let _this = this;

    let params = {
      id: _this.customs[index].id
    }

    let option = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'tenantId': 'owzp1n95',                        // 删除接口使用
      },
      body: JSON.stringify(params),
      credentials: "include"
    }

    _this.globalStore.showWait();

    return fetch(Config.custom.delete + `${_this.customs[index].id}`, option)
    .then(response => {
      _this.globalStore.hideWait();
      return response.ok ? response.json() : {}
    })
    .then(data => {
      if (data.status) {
        GlobalStore.showInfo("删除成功");
        callback();
      } else {
        GlobalStore.showError(data.msg);
      }
    })
  }

  // 档案新增、编辑接口
  @action
  viewMoreSave(flag) {
    let _this = this;
    _this.globalStore.showWait();

    if(flag == 'add') {
      console.log(_this.staffViewSaveData)
      let option = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'userId': '2c179f11b41643fcb61508d86b798910',  // 新增接口使用
          'tenantId': 'owzp1n95',                        // 新增接口使用
          'sysId': 'all',                                // 新增接口使用
        },
        body: JSON.stringify(_this.staffViewSaveData),
        credentials: "include"
      }

      return fetch(Config.custom.viewMoreSave, option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
    }

    if(flag == 'edit') {
      let param =  Object.assign(_this.staffViewSaveData, {'id': this.selectedEditId});
      let option = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'userId': '2c179f11b41643fcb61508d86b798910',  // 新增接口使用
          'tenantId': 'owzp1n95',                        // 新增接口使用
          'sysId': 'all',                                // 新增接口使用
        },
        body: JSON.stringify(param),
        credentials: "include"
      }
      return fetch(Config.custom.viewMoreEdit +`${param.id}`, option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
    }
  }

  // 引用档案查询接口
  @action
  queryEntitiy() {
    let _this = this;
    _this.globalStore.showWait();

   //let param = { };

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        'mode': "no-cors",
        'tenantId': 'owzp1n95',                        // 查询接口使用
      },
      //body: JSON.stringify(param),
      //credentials: "include"
    }

    return (
      fetch(Config.custom.queryEntitiy, opt)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => {
        if (data.status) {
          //_this.queryEntitiyData.replace(data.data);
          console.log('引用档案', data.data);
          //callback(data.data);
        }
        else {
          _this.globalStore.showError(!data.msg ? "查询失败" : data.msg);
        }
      }).catch(function (err) {
        _this.globalStore.hideWait();
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }
}

export default CustomStore;