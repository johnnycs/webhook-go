import React from 'react'
import { connect } from 'react-redux'
import Main from '../components/Main'
import { load, setSearch } from '../actions/data'


  const mapStateToProps = state => {
    return {}
  }

  const mapDispatchToProps = dispatch => {

    return {
      onLoad: () => {
      }
    }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Main)
