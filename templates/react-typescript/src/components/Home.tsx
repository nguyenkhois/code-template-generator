import React from 'react';
import { HomeProps } from '../types/HomeType';

/* 
... extends React.Component <props, state> {...}
-> 'HomeProps' describes the shape of props.
-> State is never set so we use the '{}' type.
*/

class Home extends React.Component <HomeProps, {}> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <h1 className="welcome">
                <img src="./images/icon-home.png" alt="Home" />
                Welcome to the project template by using {this.props.framework} and {this.props.compiler}!
            </h1>
        );
    }
}

export default Home;