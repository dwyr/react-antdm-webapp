import React from 'react';
import ReactDom from 'react-dom';
import {Router, Route, Link, IndexRoute, hashHistory} from 'react-router';

import App from './containers/App';
import PersonChar from './containers/PersonChar';



ReactDom.render(
    <Router onUpdate={() => window.scrollTo(0, 0)} history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={ PersonChar } />
      </Route>
    </Router>,
    document.getElementById('root')
);
