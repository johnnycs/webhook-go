import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
export default class UserDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      name: "",
      id: "",
    };
  }

  handleOpen = () => {
    this.setState({open: true, id: this.props.data.wid});
    // fetch(api+this.props.data.wid+"?access_token="+token)
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({name:data.name})
    //   })
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    return (
      <div>
        <RaisedButton label="Show User" onClick={this.handleOpen} />
        <Dialog
          title="User's Facebook Page"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose} >
          <a href={"https://facebook.com/"+this.state.id}>{this.state.id}</a>
        </Dialog>
      </div>
    );
  }
}
