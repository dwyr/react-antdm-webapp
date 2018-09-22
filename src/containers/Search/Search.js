/**
 * Created by Administrator on 2018/6/24.
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Tabs, SearchBar, Button, WhiteSpace, WingBlank} from 'antd-mobile';
import NavBarTop from '../../components/NavBarTop'

@observer
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '美食'
    }
  }

  componentDidMount() {
    this.autoFocusInst.focus();
  }
  onChange= (value) => {
    this.setState({ value });
  };
  clear = () => {
    this.setState({ value: '' });
  };
  handleClick = () => {
    this.manualFocusInst.focus();
  }

  render() {
    return (
      <div style={{ height: '250px' }}>
        <NavBarTop name="搜索"/>
        <WingBlank><div className="sub-title">Normal</div></WingBlank>
        <SearchBar placeholder="Search" maxLength={8} />
        <WhiteSpace />
        <WingBlank><div className="sub-title">AutoFocus when enter page</div></WingBlank>
        <SearchBar placeholder="自动获取光标" ref={ref => this.autoFocusInst = ref} />
        <WhiteSpace />
        <WingBlank><div className="sub-title">Focus by operation</div></WingBlank>
        <SearchBar
          placeholder="手动获取获取光标"
          ref={ref => this.manualFocusInst = ref}
        />
        <WhiteSpace />
        <WingBlank>
          <Button
            onClick={this.handleClick}
          >click to focus</Button>
        </WingBlank>
        <WhiteSpace />
        <WingBlank><div className="sub-title">Show cancel button</div></WingBlank>
        <SearchBar
          value={this.state.value}
          placeholder="Search"
          onSubmit={value => console.log(value, 'onSubmit')}
          onClear={value => console.log(value, 'onClear')}
          onFocus={() => console.log('onFocus')}
          onBlur={() => console.log('onBlur')}
          onCancel={() => console.log('onCancel')}
          showCancelButton
          onChange={this.onChange}
        />
      </div>
    )
  }
}


export default Search;
