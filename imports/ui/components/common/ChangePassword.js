import React from 'react';
import { Link, browserHistory } from 'react-router';
//ANTD
import Button from 'antd/lib/button';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Card from 'antd/lib/card';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
//modules
import { handlePasswordChange } from '/imports/modules/helpers';
import { FormErrorArea } from './FormErrorArea'
//
import { Accounts } from 'meteor/accounts-base'
// CONSTANTS & DESTRUCTURING
// ================================
const FormItem = Form.Item;


// STYLES
// ================================
const styles = {
  cardStyles: {
    "width": 400,
    "margin": "auto",
    "marginTop": "40px",
    "padding": "20px",
  },
  textField: {
    display: "block",
    width: "70%",
    margin: "auto",
    background: "#ffffff",
    backgroundColor: "#ffffff",
    marginBottom: "20px",
  },
};


// EXPORTED COMPONENT
// ================================
 class FormComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      errors: []
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({loading: true});

    const failure = () => {
      this.setState({loading: false});
    }
    const success = () => {
      this.setState({loading: false});
      
    }

    this.props.form.validateFields((err, values) => {
      if (err) { return failure(); }

      if (!err) {
        let { oldPassword, newPassword } = values;
        Accounts.changePassword(oldPassword, newPassword, (err, res) => {
          if(err) { return console.log(err); }
          message.success('password changed!', 3);
          this.setState({loading: false});
          return this.props.form.resetFields();
        });
        //handlePasswordChange(oldPassword, newPassword, this);
      }
    });

  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Your passwords that you entered are inconsistent!');
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    <Card title='Change Password' style={{width: 450, margin: 'auto'}}>
      <Form onSubmit={this.handleSubmit} >
      <Row gutter={15} type="flex" justify="center" align="middle"  >
      <Col span='24'>
        <FormItem label='old password'>
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: 'Please input a Password!' }],
          })(
            <Input type="password" placeholder="Old Password" />
          )}
        </FormItem>
      </Col>
      <Col span='12'>
        <FormItem label='new password'>
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: 'Please input a Password!' }],
          })(
            <Input type="password" placeholder="New Password" />
          )}
        </FormItem>
      </Col>
      <Col span='12'>
        <FormItem label='confirm new password' hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" placeholder="Confirm Password" />
          )}
        </FormItem>
      </Col>
      <Col span='24'>
        <FormItem>
          <Button loading={this.state.loading} htmlType="submit" type='primary'>
            CHANGE PASSSWORD
          </Button>
        </FormItem>
      </Col> 
      </Row>
      </Form>
      <FormErrorArea errors={this.state.errors} />
      </Card>
    );
  }
 }


let ChangePassword = Form.create()(FormComponent)

 export { ChangePassword }