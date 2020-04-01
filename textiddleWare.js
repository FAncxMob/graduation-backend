let koa = require('koa')
let app = new koa()
const responseTime = async (ctx, next) => {
    let start = Date.now()
    console.log(`1. responseTime ${start}`)
    await next();
    let ms = Date.now() - start
    console.log(`8. X-Response-Time: ${ms}ms`)
}
const logger = async (ctx, next) => {
    let start = Date.now()
    console.log(`2. logger ${start}`)
    await next()
    let used = Date.now() - start
    console.log(`7. logger %s %s %s %sms`, ctx.method, ctx.originalUrl, ctx.status, used)
}
const body = async (ctx, next) => {
    console.log(`4. body`)
    await next()
    if (ctx.path !== '/testMiddleWare') return
    console.log(`5. body ${ctx.path}`)
    ctx.body = 'Hello World'
}
app.use(responseTime)
app.use(logger)
app.use(body)
app.listen(3000)