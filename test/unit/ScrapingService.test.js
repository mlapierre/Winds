let assert = require('chai').assert,
	sinon = require('sinon')



describe('ScrapingService', function() {

	describe('scrapeFeed', function() {
        it('scrapes', function(done) {
        	let feed = {
        			feedUrl: 'https://theconversation.com/articles.atom',
        			id: '5828e3952e95056d124a23a7',
        			site: '5828e3952e95056d124a23a6',
        			topic: '5828e3952e95056d124a23a3'
        		},
        		numberOfActivities = 1

			// sinon.stub(StreamService.client, 'feed', function(feed, id) {
			//     return {
			//     	addActivity: function(activity) {
	  //       			return  'activityResponse'
	  //       		}
	  //       	}
			// })
			sinon.stub(Articles, 'findOrCreate', function(data, properties) {
				return {
					exec: function(e, f) {
						return 'activityResponse'
					}
				}
			})

        	ScrapingService.scrapeFeed(feed, numberOfActivities, function(err, response) {
        		try {
        			assert.deepEqual(response, 'activityResponse')
        			done()
        		} catch (e) {
        			done(e)
        		}
        	})
        })
    })

})