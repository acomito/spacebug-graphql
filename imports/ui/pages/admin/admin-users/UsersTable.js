// TOP LEVEL IMPORTS
import React from 'react';
import { Link } from 'react-router';
// ANTD
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Tag from 'antd/lib/tag';
import Input from 'antd/lib/input';
// APOLLO
import { GET_USERS_ADMIN } from '/imports/ui/apollo/queries';
import { graphql } from 'react-apollo';
//COMPONENTS
import UserForm from '/imports/ui/components/admin/UserForm'
// REDUX
import { connect } from 'react-redux'
import * as actions from '/imports/ui/redux/actions'


// CONSTANTS & DESTRUCTURING
// ====================================
const Search = Input.Search;


const columns = [
	{
	  title: '_id',
	  dataIndex: '_id',
	  key: '_id',
	  render: _id => <Link to={`/admin/users/${_id}`}>{_id}</Link>,
	},
	{
	  title: 'email',
	  dataIndex: 'emails.0.address',
	  key: 'emails.0.address'
	},
	{
	  title: 'Name',
	  dataIndex: 'profile.firstName',
	  key: 'profile.firstName',
	  render: (text, { profile }, index) => {
	  	return <p>{profile.firstName} {profile.lastName}</p>
	  }
	},
	{
	  title: 'role',
	  dataIndex: 'roles',
	  render: (text, { roles }, index) => {
	  	return roles && roles.length > 0 && roles.map( item => {
	  		let color = item !== 'admin' ? "#2db7f5" : "#e67e22";
	  		return (
	  			<Tag key={item} color={color}>
	  				{ item }
	  			</Tag>
	  		)
	  	})
	  }
	},
	{
	  title: 'group',
	  render: (text, { profile }, index) => {
	  	if (!profile.groupId) {
	  		return <Tag color="#f1c40f">No Group</Tag>
	  	}
	  	return <Link to={`/admin/groups/${profile.groupId}`} >{ profile.groupId }</Link>
	  }
	},
];


class UsersTable extends React.Component {
	render(){
		
		const { loading, usersAdmin } = this.props.data;
		if (loading) { return <div>Loading...</div>; }

		return (
			<Table
				rowKey={record => record._id} 
				columns={columns} 
				dataSource={this.props.data.usersAdmin}  
			/>
		);
	}
}



let options = (props) => {
	let variables = {
		params: {
			searchText: props.searchText
		}
	}

	return { variables }
}


let ComponentWithData = graphql(GET_USERS_ADMIN, { options })(UsersTable);

let mapStateToProps = ({ search }) => {
	
	const { searchText } = search;
	
	return {
		searchText
	}
}

export default connect(mapStateToProps, actions)(ComponentWithData)