import React, { Component } from 'react';
import Toggle from 'material-ui/Toggle';
import { Grid, Row, Col } from 'react-flexbox-grid';

const context = ["birthday", "events", "email", "feed", "friends", "status"]

class UseContext extends Component {
  constructor (props) {
    super(props)
  }
  handleToggle = (event, isInputChecked) => {
    let newValue = this.props.data.map(item => item);
    let ctx = event.target.name;
    if (isInputChecked) {
      newValue.push(ctx)
    }
    else {
      let deleteIndex = newValue.findIndex((item) => {return item == ctx});
      newValue.splice(deleteIndex, 1)
    }
    this.props.onChange({
      target: {
        type: 'array',
        value:  newValue
      }
    })
  }
  render () {
    const styles = {
      block: {
        maxWidth: 150,
      },
      toggle: {
        marginTop: 16,
      }
    }
    return (
      <div>
        <Grid fluid>
          {/* <Row between="xs">

          </Row> */}
          <Row between="xs">
            {context.map((ctx,idx) => (
            <Col xs={4} key={idx}>
              <div style={styles.block}>
                <Toggle
                  name={ctx}
                  label={ctx}
                  toggled={this.props.data.indexOf(ctx) >= 0}
                  style={styles.toggle}
                  onToggle={this.handleToggle}
                />
              </div>
            </Col>
            ))}
          </Row>
        </Grid>
      </div>
    )
  }
}

export default UseContext;
