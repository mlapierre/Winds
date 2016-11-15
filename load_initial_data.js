var Sails      = require('sails').Sails,
    app        = Sails(),
    argv       = require('yargs').argv,
    striptags  = require('striptags'),
    moment     = require('moment'),
    urlLibrary = require('url'),
    async      = require('async');

var initialData = {
    'Programming': [
        {'name': 'Hacker News', 'rss': 'https://news.ycombinator.com/rss', 'url': 'https://news.ycombinator.com/'}
    ],
    'Technology': [
        {'name': 'Ars Technica', 'rss': 'https://www.r-bloggers.com/feed/', 'url': 'http://arstechnica.com/'}
    ],
    'News': [
        {'name': 'The Conversation', 'rss': 'https://theconversation.com/articles.atom', 'url': 'https://theconversation.com/'}
    ]
}

app.load({
    hooks: { grunt: false },
    log: { level: 'info' }
}, function sailsReady(err) {

    if (err) {
        sails.sentry.captureMessage(err)
        return process.exit(1);
    }

    sails.log.info('Starting to load the initial data...');

    let topicNames = Object.keys(initialData)

    function createTopic(topicName, callback) {

        sails.models.topics.findOrCreate({'name': topicName}).exec(function (err, topic) {
            sails.log.info(`inserted topic ${topicName}`)
            callback(err, topic)
        })

    }

    async.map(topicNames, createTopic, function(err, topics) {

        if (err) {
            sails.sentry.captureMessage(err)
            process.exit(0)
        }

        sails.log.info('inserted all topics, feeds are up next')
        function insertFeeds(topic, callback) {

            let feedsToCreate = initialData[topic.name]

            function createFeed(feedToCreate, callback) {

                let url = feedToCreate.url || feedToCreate.rss,
                    hostname = urlLibrary.parse(url).hostname

                 sails.models.sites.findOrCreate({ siteUrl: hostname }, { siteUrl: hostname, name: feedToCreate.name }).exec(function(err, site) {

                     sails.log.info(`inserted site ${hostname}`)

                     if (err) {
                        sails.sentry.captureMessage(err)
                        process.exit(0)
                     }

                     sails.models.feeds.findOrCreate({site: site.id, feedUrl: feedToCreate.rss, topic:topic.id}).exec(function(err, feedObject) {
                         if (err) {
                            sails.sentry.captureMessage(err)
                            process.exit(0)
                         }
                         sails.log.info(`inserted feed ${feedObject.feedUrl}`)
                         callback(err, feedObject)
                     })

                 })

            }

            async.map(feedsToCreate, createFeed, callback)

        }

        async.map(topics, insertFeeds, function(err, results) {

            if (err) {
                sails.sentry.captureMessage(err)
                process.exit(0)
            }

            sails.log.info('Completed inserting feeds, wicked!')
            sails.log.info('All done setting up your initial data...')

            process.exit(0)

        })
    })

});
