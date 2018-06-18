/*
 *  定义自定义项 列表页
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Pagination} from 'react-bootstrap';

import CustomListAddOrEdit from '../../components/custom/CustomListAddOrEdit';
import Utils from '../../components/utils';
import moment from 'moment';
import {Scrollbars} from 'react-custom-scrollbars';

import GlobalStore from '../../stores/GlobalStore';
import CustomStore from '../../stores/custom/CustomStore';

@observer
class CustomList extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isHasData: this.store.tableDataTitle,   // 列表没有数据时显示内容
      activePage: 1,  // 分页当前页
      totalPage: 1,   // 分页总页数
    }

    this.handlePagination = this.handlePagination.bind(this);
    this.onChangeDoctype = this.onChangeDoctype.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeTypeName = this.onChangeTypeName.bind(this);
  }

  componentWillMount() {
    const itemPerPage = this.store.pageNumber;
    let _this = this;
    _this.mounted = true;


    // 自定义下的查询类型
    let queryType = this.props.routeParams.id;
    this.store.defaultDoctype = queryType;

    // 初始化查询
    _this.store.getCustomList({startIndex: 1, itemPerPage: itemPerPage, queryType: queryType}, (data) => {
      // 存储当前页的值
      _this.store.activePageSize = 1;
      if(_this.mounted) {
        _this.setState({
          totalPage: data.totalPages,
          activePage: 1
        });
      }
    });

  }

  componentDidMount() {
    document.title = "自定义项";

  }

  componentWillUnmount() {
    let _this = this;
    _this.mounted = false;
  }

  // 分页
  handlePagination(nextPage, event) {
    event.preventDefault();
    let _this = this;
    const itemPerPage = _this.store.pageNumber;
    // 自定义下的查询类型
    let queryType = this.props.routeParams.id;

    _this.store.getCustomList({startIndex: nextPage, itemPerPage: itemPerPage, queryType: queryType}, () => {
      _this.store.activePageSize = nextPage;
      _this.setState({
        activePage: nextPage
      });
    });
  }

  // 新增、编辑
  handleAdd(index, flag) {
    if (flag === 'add') {
      Object.assign(this.store.custom, {
        "name": "",
        "type": "string",
        "reftype": "adminorg",
        "doctype": this.store.defaultDoctype,
        "attrlength": "",
        "attrprecision": "",
        "creator": "",
        "creationtime": "",
        "modifier": "",
        "modifiedtime": ""
      });
      Object.assign(this.store.custom, {'attrlength': '256', 'attrprecision': '0'});
      this.store.precisionNULL = true;
      this.store.lengthNull = false;
      Object.assign(this.store.instancefileValue, {'code': 'adminorg', 'name': '行政组织'});
      Object.assign(this.store.datatypeVale, {'code': '1', 'name': '字符串'});
    }
    if (flag === 'edit') {
      let currentData = this.store.customs[index];
      Object.assign(this.store.custom, {
        "id": currentData.id,
        "name": currentData.name,
        "type": currentData.type,
        "reftype": currentData.reftype,
        "attrlength": currentData.attrlength,
        "attrprecision": currentData.attrprecision,
        "creator": currentData.creator,
        "creationtime": moment(currentData.creationtime).format("YYYY-MM-DD"),
        "modifier": currentData.modifier,
        "modifiedtime": moment(currentData.modifiedtime).format("YYYY-MM-DD")
      });
      this.onChangeDoctype(currentData.doctype);
      this.onChangeType(currentData.type);
      this.onChangeTypeName(currentData.type);
    }

    this.refs.customcard.show({index, store: this.store, flag});
    this.store.page = 2;
  }

  // 数据类型转换事件
  onChangeTypeName(param) {
    switch (param) {
      case '1':
        return Object.assign(this.store.datatypeVale, {'code': '1', 'name': '字符串'});
        break;
      case '4':
        return Object.assign(this.store.datatypeVale, {'code': '4', 'name': '整数'});
        break;
      case '31':
        return Object.assign(this.store.datatypeVale, {'code': '31', 'name': '数值'});
        break;
      case '32':
        return Object.assign(this.store.datatypeVale, {'code': '32', 'name': '布尔类型'});
        break;
      case '33':
        return Object.assign(this.store.datatypeVale, {'code': '33', 'name': '日期'});
        break;
      case '34':
        return Object.assign(this.store.datatypeVale, {'code': '34', 'name': '日期时间'});
        break;
      case '201':
        return Object.assign(this.store.datatypeVale, {'code': '201', 'name': '自定义档案'});
        break;
      case '201':
        return Object.assign(this.store.datatypeVale, {'code': '201', 'name': '基本档案'});
        break;
      default:
        break;
    }
  }

  // 引用档案类型 切换事件
  onChangeDoctype(param) {
    switch (param) {
      case "adminorg":
        return Object.assign(this.store.instancefileValue, {'code': 'adminorg', 'name': '行政组织'});
        break;
      case "staff":
        return Object.assign(this.store.instancefileValue, {'code': 'staff', 'name': '员工'});
        break;
      case "supplier":
        return Object.assign(this.store.instancefileValue, {'code': 'supplier', 'name': '供应商'});
        break;
      case "supplierbkAccount":
        return Object.assign(this.store.instancefileValue, {'code': 'supplierbkAccount', 'name': '供应商银行账号'});
        break;
      case "customer":
        return Object.assign(this.store.instancefileValue, {'code': 'customer', 'name': '客户'});
        break;
      case "customerbkAccount":
        return Object.assign(this.store.instancefileValue, {'code': 'customerbkAccount', 'name': '客户银行账号'});
        break;
      case "materials":
        return Object.assign(this.store.instancefileValue, {'code': 'materials', 'name': '物料'});
        break;
      case "project":
        return Object.assign(this.store.instancefileValue, {'code': 'project', 'name': '项目'});
        break;
      default:
        break;
    }
  }

  // 数据类型 长度、精度联动事件
  onChangeType(value) {
    switch (value) {
      case 'string':
        Object.assign(this.store.custom, {'attrlength': '256', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = false;
        break;
      case 'integer':
        Object.assign(this.store.custom, {'attrlength': '8', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = false;
        break;
      case 'double':
        Object.assign(this.store.custom, {'attrlength': '8', 'attrprecision': '2'});
        this.store.precisionNULL = false;
        this.store.lengthNull = false;
        break;
      case 'boolean':
        Object.assign(this.store.custom, {'attrlength': '1', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case 'date':
        Object.assign(this.store.custom, {'attrlength': '0', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case 'datetime':
        Object.assign(this.store.custom, {'attrlength': '0', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case 'ref':
        Object.assign(this.store.custom, {'attrlength': '36', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case 'list':
        Object.assign(this.store.custom, {'attrlength': '36', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      default:
        break;
    }
  }

  // 删除
  doDelete(index, event) {
    GlobalStore.showCancelModel('确定要删除这条信息吗？', () => {
    }, () => {
      this.store.handleDelete(index, () => {
        this.handlePagination(this.store.activePageSize, event);
      });
    });
  }

  render() {
    return (
      <div className="container-fluid" style={{'paddingBottom':'30px'}}>
        <div className={this.store.page=='1'?'database-container':'hidden'}>
          <div className="head">
            <div className="head-r fr">
              <button className="btn btn-primary mr15" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
              <button className="btn btn-primary mr10">配置显示</button>
            </div>
          </div>
          <div className="currency-content" style={{'paddingBottom':'0'}}>
            <div className="currency-grid" style={{'height': '450px'}}>
              <Scrollbars
                autoHeight
                autoHeightMax={450}
                universal={true}>
                <table className="table" style={{'borderTop': 'none', 'borderLeft': 'none', 'borderRight':'none'}}>
                  <thead>
                  <tr>
                    <th style={{'width':'9%'}}>名称</th>
                    <th style={{'width':'9%'}}>数据类型</th>
                    <th style={{'width':'9%'}}>引用档案</th>
                    <th style={{'width':'9%'}}>输入长度</th>
                    <th style={{'width':'9%'}}>精度</th>
                    <th style={{'width':'9%'}}>创建人</th>
                    <th style={{'width':'9%'}}>创建日期</th>
                    <th style={{'width':'9%'}}>最后修改人</th>
                    <th style={{'width':'9%'}}>最后修改日期</th>
                    <th style={{'width':'19%'}}>操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.store.customs.length > 0 ?
                      this.store.customs.map((value, index) =>
                        (<tr key={'custom-'+index}>
                          <td title={value.name}>{value.name}</td>
                          <td title={value.type}>{value.type}</td>
                          <td title={value.reftype}>{value.reftype}</td>
                          <td title={value.attrlength}>{value.attrlength}</td>
                          <td title={value.attrprecision}>{value.attrprecision}</td>
                          <td title={value.creator}>{value.creator}</td>
                          <td title={Utils.formatDate(value.creationtime)}>{Utils.formatDate(value.creationtime)}</td>
                          <td title={value.modifier}>{value.modifier}</td>
                          <td title={Utils.formatDate(value.modifiedtime)}>{Utils.formatDate(value.modifiedtime)}</td>
                          <td>
                            <button className="btn btn-operate mr10" onClick={this.doDelete.bind(this, index)}>删除
                            </button>
                            <button className="btn btn-operate" onClick={this.handleAdd.bind(this, index, 'edit')}>编辑
                            </button>
                          </td>
                        </tr>)
                      )
                      : (<tr>
                      <td colSpan="10" style={{textAlign:"center"}}>{this.state.isHasData}</td>
                    </tr>)
                  }
                  </tbody>
                </table>
              </Scrollbars>
            </div>
            <div className='database-pagination'>
              {this.store.customs.length > 0 ?
                <Pagination
                  prev
                  next
                  first={false}
                  last={false}
                  boundaryLinks
                  ellipsis
                  items={this.state.totalPage}
                  maxButtons={5}
                  activePage={this.state.activePage}
                  onSelect={this.handlePagination}
                /> : ''}
            </div>
          </div>
        </div>
        <div className={this.store.page == 2 ? '':'hidden'}>
          <CustomListAddOrEdit
            ref='customcard'
            store={this.store}
            handlePagination={this.handlePagination}
            onChangeType={this.onChangeType}
            onChangeDoctype={this.onChangeDoctype}
          />
        </div>
      </div>
    )
  }
}

export default CustomList;
