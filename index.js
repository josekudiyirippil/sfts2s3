const getOpt = require('node-getopt')
    .create([
        ['s', 'sfts-host=<string>', 'sfts host'],
        ['u', 'sfts-user=<string>', 'sfts login user name'],
        ['p', 'sfts-password=<string>', 'sfts login password'],
        ['f', 'sfts-folder=<string>', 'sfts folder'],
        ['b', 's3-bucket=<string>', 's3 bucket'],
        ['r', 's3-path-prefix=<string>', 's3 path prefix'],
        ['a', 'aws-access-key-id=<string>', 'aws access key id'],
        ['k', 'aws-secret-access-key=<string>', 'aws secret access key'],
        ['c', 'cron-time-spec=<string>', 'cron time spec'],
        ['z', 'cron-time-zone=<string>', 'cron time zone'],
        ['C', 'concurrency=<string>', 'concurrency'],
        ['h', 'help', 'display this help']
    ])
    .bindHelp(
        'Usage: node ' + process.argv[1] + ' [Options]\n[Options]:\n[[OPTIONS]]'
    )
const args = getOpt.parseSystem()
const moveFile = require('./move-file')(args)
const cronTimeSpec = args.options['cron-time-spec'] || process.env.CRON_TIME_SPEC
const cronTimeZone = args.options['cron-time-zone'] || process.env.CRON_TIME_ZONE

// add timestamp to outputs
let log = console.log
console.log = function () {
    arguments[0] = new Date().toISOString() + ': ' + arguments[0]
    log.apply(console, arguments)
}
let error = console.error
console.error = function () {
    arguments[0] = new Date().toISOString() + ': ' + arguments[0]
    info.apply(console, arguments)
}
let info = console.info
console.info = function () {
    arguments[0] = new Date().toISOString() + ': ' + arguments[0]
    info.apply(console, arguments)
}

if (!cronTimeSpec) {
    moveFile()
    return
}
const CronJob = require('cron').CronJob
new CronJob({
    cronTime: cronTimeSpec,
    onTick: moveFile,
    runOnInit: true,
    start: true,
    timeZone: cronTimeZone
})