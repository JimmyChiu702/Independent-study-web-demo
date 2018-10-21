const koaRouter = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new koaRouter();

router.get('/search/:searchText', async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.type = 'text/plain';
    ctx.response.body = await runPy(ctx.params.searchText);
})

router.get('/video/:videoName', async (ctx, next) => {
    const videoPath = path.resolve(__dirname, `../video/${ctx.params.videoName}`);
    ctx.response.type = 'video/mp4';
    ctx.response.body = fs.createReadStream(videoPath);
})

async function runPy(searchText) {
    var tags = searchText.split(' ');
    return new Promise((resolve, reject) => {
        const pythonProg = require('child_process').spawn('python', [path.resolve(__dirname, '../python/run.py')].concat(tags));

        pythonProg.stdout.on('data', data => {
            resolve(data.toString());
        });

        pythonProg.stderr.on('data', data => {
            reject(data.toString());
        });
    })
}

module.exports = router;