// top-level imports
import React from 'react';
import { Link, browserHistory } from 'react-router';
//antd
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
// apollo
import { forgotPassword } from 'meteor-apollo-accounts'
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
      margin: "0px auto",
      padding: 0,
    },
    loginButton: {
      width: '100%'
    }
  };



// INTERNAL COMPONENTS
// ====================================

class ForgotPasswordForm extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      loading: false,
      emailSent: false,
      errors: []
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let errors = [];
    this.setState({loading: true, errors})
    let _this = this;
    const { form } = _this.props;
    
    form.validateFields((err, { email }) => {
      if (err) { return this.setState({loading: false, submitted: false, errors }); }
      forgotPassword({email}, apollo)
      .then(res =>  {
        this.setState({loading: false, emailSent: true, errors})
        message.success('a recovery email has been sent to your inbox!', 4)
      })
      .catch( e => alertErrors(e, this))
    });
  }
  render(){

    const { form, onCancel } = this.props;
    const { getFieldDecorator } = form;

    if (this.state.emailSent) {
      return (
        <Card style={{height: 450, width: 500, border: 0}}>
          <h1 style={{textAlign: 'center', marginBottom: 20, color: '#000'}}>
            Please Check Your Email!
          </h1>
          <img src={'/login_img.png'} style={{height: 200, left: 0, bottom: 0, position: 'absolute'}} />
        </Card>
      );
    }

    return (
      <Card style={{height: 450, width: 500, border: 0}}>
        <h1 style={{textAlign: 'center', marginBottom: 20, color: '#000'}}>Forgot Your Password?</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!', type: 'email' }],
            })(
              <Input prefix={<Icon type="mail" />} placeholder="Enter your email..." />
            )}
          </FormItem>
          <Button loading={this.state.loading} disabled={this.state.loading} htmlType="submit" type='primary' size='large'>
              Send Instructions
          </Button>
          <Link to='/login' style={{marginTop: 10, display: 'block'}} >
            Need to login?
          </Link>
        </Form>
        <FormErrorArea errors={this.state.errors} />
      </Card>
    );
  }
}



// EXPORTED COMPONENT
// ====================================
const ForgotPasswordComponent = Form.create()(ForgotPasswordForm);




// EXPORT
// ====================================
const ForgotPassword = () => {
  return (
    <div className='public-background-gradient'>
      <div style={{width: 500, margin: 'auto', textAlign: 'center'}} >
          <ForgotPasswordComponent /> 
      </div>
    </div>
  );
}

export default ForgotPassword;

