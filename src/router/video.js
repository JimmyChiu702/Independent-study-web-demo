const koaRouter = require('koa-router');
const fs = require('fs');
const path = require('path');

const router = new koaRouter();

router.get('/search', async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.type = 'text/plain';
    ctx.response.body = await runPy(ctx.query.searchText, Number(ctx.query.tag));
})

router.get('/video/:videoName', async (ctx, next) => {
    const videoPath = path.resolve(__dirname, `../video/${ctx.params.videoName}`);
    ctx.response.type = 'video/mp4';
    ctx.response.body = fs.createReadStream(videoPath);
})

async function runPy(searchText, tagType) {
    var tags = searchText.split(' ');
    return new Promise((resolve, reject) => {
        const pythonProg = require('child_process').spawn('python3', [path.resolve(__dirname, '../python/run.py'), tags, tagType]);

        pythonProg.stdout.on('data', data => {
            resolve(data.toString());
        });

        pythonProg.stderr.on('data', data => {
            reject(data.toString());
        });
    })
}

module.exports = router;