const koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');

const router = require('./router/video.js');

const app = new koa();

app.use(koaBody());
app.use(koaStatic('./dist'))
app.use(router.routes());

const port = 80;
app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})