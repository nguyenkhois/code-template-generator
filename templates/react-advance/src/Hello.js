import React, { Component } from 'react';

class Hello extends Component {
    //Do stuff
    
    //Render
    render(){
        return(
            <div className="welcome">
                <img src="./images/icon-home.png"/>
                Welcome to React and Pure JavaScript! Babel 7 :-)
            </div>
        );
    }
};

export default Hello;