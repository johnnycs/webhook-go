import React, { Component } from 'react';
import {blue800} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MainContainer from './components/MainContainer';
import './App.css';
import { Provider } from 'react-redux';
import {load} from './actions/data';
import rootReducer from './reducers/rootReducers.js';
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
function configureStore(preloadedState) {
	return createStore(
		rootReducer,
		preloadedState,
		applyMiddleware(
			thunkMiddleware
		)
	)
}

let store = configureStore(
	{
			webhook:[],
	}
);
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const muiTheme = getMuiTheme({
      palette: {
        primary1Color: blue800,
      },
    });
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Provider store={store}>
          <MainContainer/>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
