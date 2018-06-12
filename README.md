# wiredpay-his-adapter-xiangyang

wiredpay backend service.

## QuickStart

see [egg docs](https://eggjs.org), [nuxt docs](https://nuxtjs.org), [electron](https://electron.atom.io)  for more detail.


### Development

start egg server
```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

start nuxt server 
```bash
$ npm i
$ npm run nuxt-dev
$ open http://localhost:3000/
```

install electron 
```bash
$ ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" npm install electron --save-dev --save-exact --registry=https://registry.npm.taobao.org
```
```nuxt build in msys2
PROXY_REWRITE="$(pwd)/dist/" npm run nuxt-generate-electron
```

### Build
default bashPath is /cn/, so when start server with egg(without nginx), egg can use koa-mount plugin to provide static resource. Need to be config when using Docker to build package.
- Use `PROXY_REWRITE` to modify the basePath of nginx server, for example `'/'`.Forward slashes to programs under MSYS: try substituting two slashs.
- Use `API_HOST` to modify the api backend of nuxt, default is the same as basePath.


### Deploy

```bash
$ npm start
$ npm stop
```
 

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.
- Use `npm run nuxt-dev` to run nuxt in developement mode.
- Use `npm run nuxt-build` to run nuxt in build mode.
- Use `npm run nuxt-generate` to generate static page using nuxt.
- Use `npm run js-doc` to generate js doc.
- Use `npm run electron-dev` to run electron in developement mode.
- Use `npm run electron-start` to run electron in product mode.
