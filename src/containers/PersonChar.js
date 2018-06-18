import React from 'react';
import {observer} from 'mobx-react';

import { NavBar, Icon } from 'antd-mobile';

@observer
class PersonChar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        
        }

    
    }

    componentDidMount() {
        
    }

   


    render() {
        return (
            <div>
                <NavBar leftContent="返回"
                mode="light"
                onLeftClick={() => console.log('onLeftClick')}
                rightContent={[
        <Icon key="1" type="ellipsis" />,
      ]}
        >个人维度</NavBar>
            </div>
        )
    }
}

export default PersonChar;
