import React, { Component } from 'react';
import { Alert,Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import LoginApi from './../../../services/login.service';
import logo2 from '../../../assets/img/brand/200x200.png'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      submitted: false,
      loading: false,
      error: '',
      IsError:false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.LoginApi = new LoginApi();
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(e) {
    console.log('login', this.state)
    e.preventDefault();
    const { username, password } = this.state;
      
    // stop here if form is invalid
    if (!(username && password)) {
      this.setState({IsError:true,});
      console.log('user or pass is null')
      return;
    }
    let res = await this.LoginApi.GetTokenAsync(username, password);
    console.log('res',res)
    if (res.status === 200) 
    {
      console.log(' go to mainpage')
      this.props.history.push('/mainpage');
     }else{
       this.setState({IsError:true,});
      console.log('login error',res)
     }
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-1">
                  <CardBody className="p-3">
                    <Row>
                      <Col xs="12" className="text-center">
                      <img src={logo2} height="200" width="200" alt="Me Claim 360"></img>
                      </Col>
                    </Row>
                    <Alert color="danger" isOpen={this.state.IsError}>username or password is incorrect</Alert>
                    <Form onSubmit={this.handleSubmit}>
                      {/* <h1>Login</h1> */}
                      {/* <p className="text-muted">Sign In to your account</p> */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" name="username" value={this.state.username} onChange={this.handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" name="password" value={this.state.password} onChange={this.handleChange} />
                      </InputGroup>
                      <Row>
                        <Col xs="12">
                          <Button color="primary" className="px-4 btn-block">Login</Button>
                          {/* <Button color="primary" className="px-4" onClick={ this.LoginApi.test}>test refresh</Button> */}
                          {/* <Button color="primary" className="px-4" onClick={this.LoginApi.Logout}>logout</Button> */}
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button type="button" color="link" className="px-0">Forgot password?</Button>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
