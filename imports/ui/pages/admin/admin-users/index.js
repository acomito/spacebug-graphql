// TOP LEVEL IMPORTS
import React from 'react';
//COMPONENTS
import UsersPage from './UsersPage'




class AdminUsersPage extends React.Component {

	render(){
		return (
			<div>
				{this.props.children ? this.props.children : <UsersPage {...this.props} />}
			</div>
		);
	}
}


export default AdminUsersPage;