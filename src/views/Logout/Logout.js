import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
// import {withRouter} from 'react-router-dom';
class Logout extends Component {
    
constructor(props)
{
    super(props)
    localStorage.clear();
}

    render() {
        localStorage.clear();
        return (
            <Redirect to='/login' />
        );
    }
}
export default Logout