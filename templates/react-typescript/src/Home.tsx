import React, { useEffect } from "react";

type HomeProps = {
    compiler: string;
    framework: string;
};

export default function Home(props: HomeProps) {
    useEffect(() => { }, []);

    return (
        <div className="welcome">
            <img src="./images/icon-home.png" alt="Home" />
            <span>Welcome to the project template by using {props.framework} and {props.compiler}!</span>
            <p>View more information and other project templates on <a href="https://github.com/nguyenkhois/build-environments" target="_blank"
                rel="noopener noreferrer">GitHub</a>.</p>
        </div>
    );
}