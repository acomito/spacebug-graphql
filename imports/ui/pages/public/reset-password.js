import React from 'react';
import { Link, browserHistory } from 'react-router';
//antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Card from 'antd/lib/card';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
//apollo
import { resetPassword } from 'meteor-apollo-accounts'
import apollo from '/imports/ui/apollo/ApolloClient'
import { LOGIN_LOGO, LOGIN_IMAGE } from '/imports/modules/config';
import { alertErrors} from '/imports/modules/helpers';
import { FormErrorArea } from '/imports/ui/components/common'
// CONSTANTS & DESTRUCTURING
// ====================================
const FormItem = Form.Item;


// STYLES
// ====================================
  const styles = {
    cardStyles: {
      maxWidth: 400,
      width: 400,
      margin: "auto",
      marginTop: 40,
      padding: 0,
    },
    loginButton: {
      width: '100%'
    }
  };


// INTERNAL COMPONENTS
// ====================================
const ResetPasswordForm = Form.create()(React.createClass({
  getInitialState () {
    return {
      loading: false,
      submitted: false,
      errors: []
    };
  },
  handleSubmit(e) {
    e.preventDefault();
    let errors = []
    this.setState({loading: true, errors})
    this.props.form.validateFields((err, { password, confirm }) => {
      if (err) { return this.setState({loading: false, submitted: false, errors }); }
      resetPassword({newPassword: password, token: this.props.token}, apollo)
      .then( res => {
        this.setState({loading: false, submitted: true, errors});
        apollo.resetStore();
        browserHistory.push('/app')
        return message.success('your password was reset!', 5) 
      }).catch( e => alertErrors(e, this))
    });

  },
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you entered are inconsistent!');
    } else { callback(); }
  },
  render() {
    const { getFieldDecorator } = this.props.form;

    const newPasswordRules = [
      { required: true, message: 'Please input a new password!' }
    ];

    const repeatNewPassword = [
      { required: true, message: 'Please repeat the new password!' },
      { validator: this.checkPassword }
    ];

    if (this.state.submitted) {
      return (
        <div>
          <h3>Your password has been successfully reset!</h3>
        </div>
      );
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('password', { rules: newPasswordRules })(
            <Input 
              prefix={<Icon type="lock" />}   
              type="password" 
              placeholder="New password" 
            />
          )}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('confirm', { rules: repeatNewPassword })(
            <Input 
              prefix={<Icon type="lock" />}   
              type="password" 
              placeholder="Repeat new password" 
            />
          )}
        </FormItem>
        <FormItem>
          <Button loading={this.state.loading} type="primary" htmlType="submit">
            Reset & Login
          </Button>
        </FormItem>
        <FormErrorArea errors={this.state.errors} />
      </Form>
    );
  }
}));

// EXPORTED COMPONENT
// ====================================
class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      canSubmit: false,
      token: this.props.params.token,
    }
  }

  render() {
    return (
      <div className='public-background-gradient'>
        <div style={{width: 500, margin: 'auto', textAlign: 'center'}} >
          <img src={LOGIN_LOGO} style={{height: 55, margin: 'auto', marginBottom: 20}} />
          <Card style={{height: 450, width: 500, border: 0}}>
            <ResetPasswordForm token={this.state.token} />
            <img src={LOGIN_IMAGE} style={{height: 200, left: 0, bottom: 0, position: 'absolute'}} />
          </Card>
        </div>
      </div>
    );
  }

}

export default ResetPassword
