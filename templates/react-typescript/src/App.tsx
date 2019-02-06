import * as React from 'react';
import Hello from './Hello';

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
class App extends React.Component<{}> {
    render() {
        return (
            <Hello compiler="TypeScript" framework="React"/>
        );
    }
}

export default App;