// TOP LEVEL IMPORTS
import React from 'react';
// COMPONENTS
import { AdminProfileForm } from '../../components/admin/AdminProfileForm'
import { ChangePassword } from '../../components/common';
// APOLLO
import { GET_USER_DATA } from '../../apollo/queries'
import { graphql } from 'react-apollo';



class AdminAccountPage extends React.Component {
	render(){

		if ( this.props.data.loading ) { return <div>Loading...</div>; }

		return (
			<div>
				<AdminProfileForm user={this.props.data.user} data={this.props.data} />
				<ChangePassword />
			</div>
		);

	}
}



export default graphql(GET_USER_DATA)(AdminAccountPage);
