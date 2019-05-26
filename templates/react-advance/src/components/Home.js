import React, { Component } from 'react';

class Home extends Component {
    render() {
        return (
            <div className="welcome">
                <img src="./images/icon-home.png" />
                <span>Welcome to the advanced React project template by using pure JavaScript!</span>
                <p>View more information on <a href="https://github.com/nguyenkhois/build-environments" target="_blank"
          rel="noopener noreferrer">GitHub</a>.</p>
            </div>
        );
    }
};

export default Home;