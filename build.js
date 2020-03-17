const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const buildArg = process.argv.length > 2 ? process.argv[2] : ""; // Can be --back-only or --front-only

const backConfig = {

    mode: "development",

    devtool: "source-map",

    target: "node",

    // To have right app directory name in node (false is not really intuitive ...)
    node: {
        __dirname: false,
        __filename: false
    },

    entry: {
        back: "./src/back/main-back.ts"
    },

    output: {
        filename: "[name]-app.bundle.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "commonjs2"
    },

    watch: true,

    externals: [nodeExternals()],

    resolve: {
        extensions: [".ts"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                include: [ path.resolve(__dirname, "src") ]
            }
        ]
    }

};

const frontConfig = {
    mode: "development",

    devtool: "source-map",

    entry: {
        front: "./src/front/main-front.ts"
    },

    output: {
        filename: "[name]-app.bundle.js",
        path: path.resolve(__dirname, "dist")
    },

    watch: true,

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: { appendTsSuffixTo: [/\.vue$/] },
                include: [ path.resolve(__dirname, "src") ]
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [ path.resolve(__dirname, "src") ]
            },

            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                include: [ path.resolve(__dirname, "src") ]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin()
    ]
}

// WEBPACK BUILD START HERE !
let configs = []
if (buildArg !== "--back-only") configs.push(frontConfig);
if (buildArg !== "--front-only") configs.push(backConfig);

console.log("Webpack is building (%s) ...", buildArg);
webpack(configs, (err, stats) => { 
    if (err) throw err;

    console.log(stats.toString({
        colors: true,
        modules: false,
        children: true,
        chunks: false,
        chunkModules: false
    }));
  
    if (stats.hasErrors()) {
        console.log("Webpack (%s) build failed with errors.", buildArg);
    }
    else
        console.log("Webpack (%s) build successul !", buildArg);
    
});