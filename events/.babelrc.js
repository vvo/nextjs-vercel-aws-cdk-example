// This file allows us to provide the babel configuration required by events/*.js for dev purposes
// We cannot put it at the root of the project, otherwise it would be read as the Next.js babel
// configuration.
const path = require("path");

module.exports = {
  presets: ["@babel/preset-env"],
  sourceMaps: "inline",
  plugins: [
    [
      "module-resolver",
      {
        root: path.join(__dirname, ".."),
      },
    ],
  ],
};
