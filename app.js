var twitter = require('ntwitter');
var mongoose = require('mongoose');
var twitter_conf = require('./config_twitter.js');
var config = require('./config.js');

// mapped 1-1 to Twitter object
var twschema = new mongoose.Schema(config.tw_harvest_schema_11, {autoindex: true});

var t = new twitter({
    consumer_key: twitter_conf.twit_consumer_key,
    consumer_secret: twitter_conf.twit_consumer_secret,
    access_token_key: twitter_conf.twit_access_token,
    access_token_secret: twitter_conf.twit_token_secret
});

// connect to dataabse
var db = mongoose.createConnection(config.db_host, config.db_name);
db.on('error', console.error.bind(console, 'connection error:'));

// Tweet Model object
var TweetElement = db.model(config.db_collection_twitter, twschema);

// Twitter object
var Twit = {
  'save' : function(tweet, callback) {
    TwitStore.save(tweet, callback);
  }
}

// Twitter Store Model
var TwitStore = {
  'getLastTweet' : function(callback) {
    // http://mongoosejs.com/docs/api.html#query_Query-sort
    // http://mongoosejs.com/docs/2.7.x/docs/finding-documents.html
    var q = TweetElement.findOne().limit(1);
    q.sort({ created_at: 'desc' });
    q.execFind(function(err, tweet) {
      if (err) {
        console.log('No tweet found');
        process.exit(0);
      }
      if (tweet.length === 0) {
        callback(false);
      }
      // callback last tweet
      callback(tweet[0]);
    });
  },
  'save' : function(tweet, callback) {
    twit = new TweetElement(tweet);
    twit.save(function(err, type) {
      callback(err, type);
    });
  }
}

TwitStore.getLastTweet(function(item) {
  var query = {};
  if (item) {
    query.since_id = item.id_str;
  }

  // https://dev.twitter.com/docs/api/1/get/search
  // maximum number
  query.count = twitter_conf.twitter_query_count;
  query.q = twitter_conf.twitter_harvest_search;
  query.result_type = twitter_conf.twitter_result_type;
  var url = twitter_conf.twitter_search_url;

  t.get(url, query, function(err, data) {
    if (typeof(data) != 'undefined' && data.statuses.length) {
      res = data.statuses;
      counter = 0;
      res.forEach(function (item) {
        Twit.save(item, function(err, type) {
          counter++;
          if (err) {
            console.log('Fatal error on saving tweet.');
            console.log(err);
            process.exit(0);
          }
          if (counter == res.length) {
            console.log('Imported: ' + counter + ' tweets.');
            process.exit(1);
          }
        });
      });
    }
    else {
      console.log('No fresh data available.');
      process.exit(1);
    }
  });
});
