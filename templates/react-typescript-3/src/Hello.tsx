import * as React from "react";
import { HelloProps } from './app.interfaces';

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return (
            <h1 className="welcome">
                Hello from {this.props.compiler} and {this.props.framework}!
            </h1>
        );
    }
}