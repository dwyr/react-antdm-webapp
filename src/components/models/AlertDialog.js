import PropTypes from 'prop-types';
import { observable } from 'mobx';
// import { PropTypes } from 'mobx-react';

// Default time to close alert dialog
const DefaultTimeout = 3000;

/**
 * 提示信息对话框
 * Usage:
 * new AlertDialog(); // 默认3s自动关闭
 * new AlertDialog(5000); // 设置5s自动关闭
 * TODO 将usage扔到test中
 */
export default class AlertDialog {
    /**
     * 提示类型
     * one of: "success", "warning", "danger", "info"
     */
    @observable type = 'success';
    // 是否显示
    @observable show = false;
    // 提示框中的文字
    @observable message = '';

    constructor(timeout = DefaultTimeout) {
        this.timeout = timeout;
    }

    /**
     * 显示提示框
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    show(message) {
        this.message = message;
        this.show = true;
    }

    showInfo(message) {
        this.type = 'info';
        this.message = message;
        this.show = true;
        if (this.timeout !== 0) {
            setTimeout(() => {
                this.show = false;
            }, this.timeout);
        }
    }

    showError(message) {
        this.type = 'danger';
        this.message = message;
        this.show = true;
        if (this.timeout !== 0) {
            setTimeout(() => {
                this.show = false;
            }, this.timeout);
        }
    }

    showWarning(message) {
        this.type = 'warning';
        this.message = message;
        this.show = true;
    }

    /**
     * 隐藏提示框
     * @return {[type]} [description]
     */
    hide() {
        this.message = '';
        this.show = false;
    }

    toJS() {
        return {
            type: this.type,
            show: this.show,
            message: this.message,
        };
    }

    static shape() {
        return {
            type: PropTypes.string.isRequired,
            show: PropTypes.bool.isRequired,
            message: PropTypes.string,
            /**
             * 点击Dialog上的关闭按钮的回调函数
             */
            onClose: PropTypes.func.isRequired,
        };
    }

}
