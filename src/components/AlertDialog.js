import React from 'react';
import { Alert } from 'react-bootstrap';

import AlertDialogModel from './models/AlertDialog';

const defaultProps = {
    message: '',
    onClose: function() {
      return;
    }
};

function AlertDialog({ ...props }) {
    if (props.show) {
        return (
            <div className="container ssc-alert">
                <Alert
                  bsStyle={props.type}
                  onDismiss={props.onClose}
                >
                    <p title={props.message} className="alert-tip">
                        {props.message}
                    </p>
                </Alert>
            </div>
        );
    }
    return (<div />);
}

AlertDialog.displayName = 'AlertDialog';
AlertDialog.propTypes = AlertDialogModel.shape();
AlertDialog.defaultProps = defaultProps;

export default AlertDialog;
