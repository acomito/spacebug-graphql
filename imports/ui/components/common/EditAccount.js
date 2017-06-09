// TOP LEVEL IMPORTS
import React from 'react';
import { Link, browserHistory } from 'react-router';
//APOLLO
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { SAVE_USER_ACCOUNT, SAVE_USER_IMAGE } from '/imports/ui/apollo/mutations'
//ANTD 
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Card from 'antd/lib/card';
import message from 'antd/lib/message';
// MODULES
import { states_list, selectFilterByLabel, alertErrors } from '/imports/modules/helpers'
import { UserInfoInputGroup } from './FormInputs'
import { SingleImageUpload } from './SingleImageUpload'
import { FormErrorArea } from './FormErrorArea'

// CONSTANTS & DESTRUCTURING
// ===================================
const FormItem = Form.Item;

// EXPORTED COMPONENT
// ===================================
class EditAccountForm extends React.Component {

  state = { 
    loading: false,
    image: this.props.user.profile.image || null,
    errors: []
  };
  onSuccessfulSubmit = (values) => {
    const { mutate, user, form } = this.props;
    let params = { image: this.state.image, ...values }
    let variables = { _id: user._id, params }
    mutate({ variables })
    .then(() => {
      this.setState({loading: false});
      message.info('profile saved!');
    }).catch(e => alertErrors(e, this));
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let errors = []
    const { data, mutate, user, form } = this.props;
    this.setState({loading: true});

    form.validateFields((err, values) => {
      if (err) { return this.setState({loading: false, errors }); }
      return this.onSuccessfulSubmit(values)
    });

  }
  render(){
    const { user, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card title='My Account' style={{width: 450, margin: 'auto'}}>
        <Form onSubmit={this.handleSubmit}>
          <SingleImageUpload
            defaultImage={this.state.image} 
            onSuccessfulUpload={(image) => {
              let variables = { image } 
              this.props.saveUserImage({variables}).then( res => {
                 return this.setState({image});
              });
             
            }} 
          />
          <UserInfoInputGroup 
              {...this.props}
              initialValue={{
                initialEmail: user && user.emails[0].address ? user.emails[0].address : null,
                initialFirstName: user && user.profile.firstName ? user.profile.firstName: null,
                initialLastName: user && user.profile.lastName ? user.profile.lastName: null,
                initialWorkphone: user && user.profile.workPhone ? user.profile.workPhone: null,
                initialCellphone: user && user.profile.cellPhone ? user.profile.cellPhone: null,
              }}
            />
          <FormItem>
            <Button loading={this.state.loading} htmlType="submit" type='primary'>
              SAVE CHANGES
            </Button>
          </FormItem>
        </Form>
        <FormErrorArea errors={this.state.errors} />
      </Card>
    );
  }
}



export default graphql(SAVE_USER_ACCOUNT)(
  graphql(SAVE_USER_IMAGE, { name: 'saveUserImage'})(
    Form.create()(EditAccountForm)
  )
);