import React from 'react';
import {Alert} from 'react-bootstrap';
import {observer} from 'mobx-react';
import globalStore from '../stores/GlobalStore';

@observer
class AlertFixed extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAlertDismiss = () => {
    globalStore.fixedMsg = Object.assign(globalStore.fixedMsg, {message: '', alertVisible: false});
  };

  render() {
    let _this=this;
    if (globalStore.fixedMsg.alertVisible) {
        let sign;
        switch (globalStore.fixedMsg.type) {
            case "danger":
                sign = (<i className="iconfont icon-error-sign mr5 ml5"></i>);
                break;
            case "info":
                sign = (<i className="iconfont icon-info-sign mr5 ml5"></i>);
                break;
            case "warning":
                sign = (<i className="iconfont icon-warn-sign mr5 ml5"></i>);
                break;
            default:
                sign = (<i className="iconfont icon-succ-sign mr5 ml5"></i>);
                break;
        }
      return (
          <div className="container ssc-alert">
              <Alert bsStyle={globalStore.fixedMsg.type} onDismiss={_this.handleAlertDismiss}>
                  <p title={globalStore.fixedMsg.message}>{sign}{globalStore.fixedMsg.message}</p>
              </Alert>
          </div>
      );
    }else{
      return(<div></div>)
    }
  }
}
export default AlertFixed;
