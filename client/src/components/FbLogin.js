import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';

export default class FbLogin extends Component {
  responseFacebook(response) {
    console.log(response);
  }

  render() {
    return (
      <FacebookLogin
        appId="APPID"
        autoLoad={true}
        fields="name,email,picture"
        scope="public_profile,user_friends,user_posts,email,user_events"
        callback={this.responseFacebook}
      />
    )
  }
}
