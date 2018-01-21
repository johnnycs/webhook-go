import React from 'react'
import { connect } from 'react-redux'
import TableList from './TableList'
import { load, clearData, setSearch} from '../actions/data'

export default () => {

  const mapStateToProps = state => {
    return {
      data: state,
      search: state['search'] ? state['search'] : { text: '', filters: []},
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      onLoad: () => {
        dispatch(load());
      },
      onSearch: (value) => {
        dispatch(setSearch(value));
        dispatch(clearData());
        dispatch(load());
      },
    }
  }
  return connect(mapStateToProps, mapDispatchToProps)(TableList)
}
