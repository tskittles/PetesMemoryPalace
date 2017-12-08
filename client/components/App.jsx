import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'
import Header from './Header'
import Main from './Main'


class App extends Component {

    render() {
      return(
        <div>
          <Header />
          <Main />
        </div>
      )
    }
}
export default App