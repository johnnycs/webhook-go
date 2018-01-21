import * as types from './types';

export function setSearch( data = { text: '', filters: []}) {
	let searchQuery = '';
	if (data.text) {
		let splitted = data.text.split('=');
		if (splitted.length > 1) {
			searchQuery = splitted[0] + '=' + encodeURIComponent(splitted[1]);
		}
		else {
			searchQuery += 'search=' + encodeURIComponent(data.text);
		}
	}
	if (data.filters.length > 0) {
		let joinedFilters = data.filters.join(',');
		if (searchQuery.length > 0) {
			searchQuery += '&fields=' + joinedFilters;
		}
		else {
			searchQuery += 'fields=' + joinedFilters;
		}
	}
	let newData = {
		query: searchQuery,
		text: data.text,
		filters: data.filters,
	}
	return {
		type: 'SET_SEARCH',
		data: newData
	}
}

function getSearchQuery(state) {
	if (state['search'])
		return state['search']['query'];
	return '';
}

export function load() {
	return function(dispatch, getState) {
		let searchQuery = getSearchQuery(getState());
		console.log(searchQuery);
		return fetch('<server url>/userInteraction?'+searchQuery)
		.then(async (response) => {
			let res = await response.json();
			dispatch(receivedData(res));
		}, (error) => {
			throw(error);
		});
	}
}

export function clearData() {
	return {
		type: types.CLEAR_DATA,
	}
}

export function receivedData(data) {
  return {type: types.LOAD_DATA_SUCCESS , data};
}
