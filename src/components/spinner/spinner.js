/** 加载条组件
 * 支持自定义文案，加载动画，和样式
 * 默认提供 Material , gif加载样式
**/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Gif from './gif';
import style from './style.css';
import { observer } from 'mobx-react';
import globalStore from '../../stores/GlobalStore';

// let style = require('style-loader!css-loader!./style.css');
@observer

class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!globalStore.showWaiting.show) {
            return <span />;
        }
        const size = this.props.size;
        let ste = this.props.style;
        if (size > 0) {
            ste.fontSize = size;
        }
        let loading = (
            <div className="svg-loader" style={ste}>
                <svg width="1em" height="1em" ><circle style={{ stroke: this.props.color }} cx="0.5em" cy="0.5em" r="0.45em" /></svg>
            </div>
    );
        if (this.props.type != 'svg') {
            loading = <Gif size={this.props.size} />;
        }

        if (this.props.children) {
            loading = this.props.children;
        }

    // 返回行内的加载内容
        if (this.props.display == 'inline') {
            return loading;
        }

        return (
            <div className="react-loading-spinner" >
                <div className="loading-inner">
                    {loading}
                    <div className="alert-text">{globalStore.showWaiting.text}</div>
                </div>
            </div>
        );
    }
}

Spinner.propTypes = {
    type: PropTypes.string,
    display: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    text: PropTypes.string,
    cls: PropTypes.string,
    show: PropTypes.bool
};

Spinner.defaultProps = {
    type: 'svg',
    style: {},
    color: '#00B39E',
    text: '加载中...',
    cls: '',
    show: false
};

export default Spinner;
