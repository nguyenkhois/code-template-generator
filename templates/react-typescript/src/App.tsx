import React from 'react';
import Home from './components/Home';
import './styles/app.css';

class App extends React.Component<{}> {
    render() {
        return (
            <Home compiler="TypeScript" framework="React" />
        );
    }
}

export default App;