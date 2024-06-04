const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("./package.json");
const dependencies = packageJson.dependencies;

module.exports = {
  output: {
    uniqueName: "shell",
    publicPath: "auto",
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
    },
    alias: {},
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      filename: "remoteEntry.js",
      library: { type: "module" },
      exposes: {
        "./AuthService": "./src/app/services/auth.service.ts",
        "./selectIsLogin": "./src/app/states/auth/auth.selector.ts",
        "./updateIsLogin": "./src/app/states/auth/auth.action.ts",
      },
      shared: {
        "@ngrx/store": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@ngrx/store"],
        },
        "@ngrx/effects": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@ngrx/effects"],
        },
        "@ngrx/store-devtools": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@ngrx/store-devtools"],
        },
        rxjs: {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["rxjs"],
        },
        "@angular/core": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@angular/core"],
        },
        "@angular/common": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@angular/common"],
        },
        "@angular/router": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@angular/router"],
        },
        "@angular/forms": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@angular/forms"],
        },
        "@angular/common/http": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["@angular/common/http"],
        },
      },
    }),
  ],
};