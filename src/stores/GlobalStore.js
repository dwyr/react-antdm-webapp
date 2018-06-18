/**
 * 全局store, 在整个App的生命周期生存
 */
import {observable, computed, action} from 'mobx';
import AlertDialog from '../components/models/AlertDialog';

class GlobalStore {

  @observable alertDialog = new AlertDialog(3000);

  // 提示信息
  @observable alertMsg = {
    message: '',
    alertVisible: false,
    type: 'danger', // "success", "warning", "danger", "info"
    autoClose: false,
  };

  // 提示信息
  @observable modelMsg = {
    message: '',
    modelVisible: false,
    hasCancel: false,
    cancelFn: null,
    sureFn: null
  };

  // 提示信息
  @observable fixedMsg = {
    message: '',
    alertVisible: false,
    type: 'success', // "success", "warning", "danger", "info"
    autoClose: true,
  };
  @observable showWaiting = {
    show: false,
    text: '加载中...'
  };

  // 用弹窗的方式显示提示信息
  @action showModel(msg) {
    this.modelMsg = Object.assign(this.modelMsg, {
      message: msg,
      modelVisible: true,
      hasCancel: false,
      cancelFn: null,
      sureFn: null
    });
  }

  // 用弹窗的方式显示提示信息
  @action showCancelModel(msg, cancelFn, sureFn) {
    this.modelMsg = Object.assign(this.modelMsg, {message: msg, modelVisible: true, hasCancel: true, cancelFn, sureFn});
  }

  // 显示成功提示信息
  @action showInfo(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'success',
      autoClose: true,
      alertVisible: true
    });
    if (this.alertMsg.autoClose) {
      setTimeout(() => {
        this.alertMsg = Object.assign(this.alertMsg, {message: '', alertVisible: false});
      }, 3000);
    }
  }

  // 显示普通提示信息
  @action showWarning(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'info',
      autoClose: true,
      alertVisible: true
    });
    if (this.alertMsg.autoClose) {
      setTimeout(() => {
        this.alertMsg = Object.assign(this.alertMsg, {message: '', alertVisible: false});
      }, 3000);
    }
  }

  // 显示错误提示信息
  @action showError(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'danger',
      autoClose: false,
      alertVisible: true
    });
    setTimeout(() => {
      this.alertMsg = Object.assign(this.alertMsg, {message: '', alertVisible: false});
    }, 3000);
  }

  // 隐藏提示信息
  @action hideAlert() {
    this.alertMsg = Object.assign(this.alertMsg, {message: '', alertVisible: false});
  }

  // 显示不被路由删除的信息
  @action showFixed(msg) {
    this.fixedMsg = Object.assign(this.fixedMsg, {
      message: msg,
      alertVisible: true
    });
    if (this.fixedMsg.autoClose) {
      setTimeout(() => {
        this.fixedMsg = Object.assign(this.fixedMsg, {message: '', alertVisible: false});
      }, 3000);
    }
  }

  // 隐藏不被路由删除的信息
  @action hideFixed() {
    this.fixedMsg = Object.assign(this.fixedMsg, {message: '', alertVisible: false});
  }

  // 显示等待遮罩
  @action showWait() {
    this.showWaiting = Object.assign(this.showWaiting, {show: true});
  }

  // 隐藏等待遮罩
  @action hideWait() {
    this.showWaiting = Object.assign(this.showWaiting, {show: false});
  }
}


export default new GlobalStore();
