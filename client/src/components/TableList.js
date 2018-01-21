import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { withRouter } from 'react-router'
import TopBar from './TopBar';
import Filters from './Filters';
import UserDialog from './UserDialog';
import SearchBar from 'material-ui-search-bar';
import {Card, CardActions, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { Grid, Row, Col } from 'react-flexbox-grid';

class TableList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text:'',
      filters:[],
    }
    this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }
  componentDidMount() {
    this.props.onLoad();
  }
  handleSearchKeyChange(value) {
    this.setState({text:value})
  }
  handleSearch() {
    this.props.onSearch(this.state)
  }
  handleFilterChange(event) {
    let curFilters = this.state.filters.map(filter => filter);
    curFilters = event.target.value;
    this.setState({filters:curFilters})
  }
  isString(value) {
    return typeof value === 'string'
  }
  renderValue(row) {
    if (row.field === 'events') {
      return row.value.verb + " " + row.value.event_id
    }
    if (row.field === 'friends') {
      return row.verb + " " + row.value.uid
    }
    return "N/A"
  }
  render() {
    let dataExists = this.props.data.webhook && this.props.data.webhook.length > 0;
    const styles = {
      searchBarStyle : {
        margin: 'auto',
        marginTop: "15px",
        marginBottom: "5px",
        width: '60%',
      },
      cardStyle : {
        width: '60%',
        margin: 'auto',
        marginBottom: '10px'
      }
    }
    return (
      <div>
        <TopBar/>
        <SearchBar
          onChange={this.handleSearchKeyChange}
          onRequestSearch={this.handleSearch}
          style={styles.searchBarStyle} />
        <Card style={styles.cardStyle}>
          <CardTitle title="Filters" showExpandableButton={true}/>
          <CardText expandable={true}>
            <Filters data={this.state.filters} onChange={this.handleFilterChange}/>
          </CardText>
        </Card>
        {dataExists ?
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>User Id</TableHeaderColumn>
                <TableHeaderColumn>Field</TableHeaderColumn>
                <TableHeaderColumn>Value</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              { this.props.data.webhook.map((row,idx) => (
                <TableRow key={idx}>
                  <TableRowColumn><a href={"https://facebook.com/"+row.wid}>{row.wid}</a></TableRowColumn>
                  <TableRowColumn><span>{row.field}</span></TableRowColumn>
                  {this.isString(row.value) ?
                    <TableRowColumn><span>{row.value}</span></TableRowColumn> :
                    <TableRowColumn><span>{this.renderValue(row)}</span></TableRowColumn> }
                </TableRow>
              ))}
            </TableBody>
          </Table> :
          <Grid><Row center="xs"><Col>
          <CircularProgress style={{marginTop:"100px"}} size={150} thickness={5} />
          </Col></Row></Grid>
        }
      </div>
    )
  }
}
export default withRouter(TableList)
