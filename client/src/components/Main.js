import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import ListContainer from './ListContainer';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import {load, setSearch} from '../actions/data';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.responseFacebook = this.responseFacebook.bind(this)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  responseFacebook(response) {
    this.setState({response})
  }

  render() {
    let loggedIn = this.state.response && this.state.response.name;
    let ListPage = ListContainer();
    return (
      <Router>
      <div>
        {loggedIn ?
          <Route exact path="/" component={ListPage}/> :
          <Grid fluid style={{marginTop:"250px"}}>
            <Row center="xs">
            <FacebookLogin
              appId="1497926116985976"
              autoLoad={true}
              fields="name,email,picture"
              scope="public_profile,user_friends,user_posts,email,user_events"
              callback={this.responseFacebook}
            />
            </Row>
          </Grid>
        }
      </div>
      </Router>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     data: state.data,
//   }
// }
//
// const mapDispatchToProps = dispatch => {
//   return {
//     onLoad: () => {}
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(List);
