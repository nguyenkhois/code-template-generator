module.exports = function (api) {
    api.cache.never();
    
    const presets = [
        ["@babel/preset-env", {
            "targets": {
                "node": "10"
            },
        }],
        "@babel/preset-react"
    ];
    
    const plugins = [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import"
    ];

    return {
        presets,
        plugins
    };
}
