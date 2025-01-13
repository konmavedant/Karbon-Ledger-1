self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/admin-dashboard": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/admin-dashboard.js"
    ],
    "/profile-page-user": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/profile-page-user.js"
    ],
    "/project-detail-page-user": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/project-detail-page-user.js"
    ],
    "/user-certificates-page": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user-certificates-page.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];