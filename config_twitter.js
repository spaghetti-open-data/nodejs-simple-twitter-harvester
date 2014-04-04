// twitter secret configuration
var twitter_conf = {
  // twitter conf
  twit_consumer_key: 'YOUR_TWITTER_APP_CONSUMER_KEY',
  twit_consumer_secret: 'YOUR_TWITTER_APP_CONSUMER_SECRET',
  twit_access_token: 'YOUR_TWITTER_APP_ACCESS_TOKEN',
  twit_token_secret: 'YOUR_TWITTER_APP_TOKEN_SECRET'

  // twitter seach
  twitter_harvest_search: '#HASHTAG_TO_SEARCH', // hashtags can be combined (example #apple OR #pear)
  twitter_query_count: 100,
  twitter_result_type: "recent",
  twitter_search_url: 'https://api.twitter.com/1.1/search/tweets.json',

}
module.exports = twitter_conf;
