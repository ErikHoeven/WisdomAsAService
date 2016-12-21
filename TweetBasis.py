from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
from tweepy.auth import API
import time
import json


# Twitter Credentials
ckey = 's9eO9Ftuy42cgTkUetOzukbX9'
csecret = 'QpzB5NCKeoqKOLYkncJyvpA4ZE2oeY751kyvilzs7hCczJoaE9'
atoken = '169505005-l7IoKI6PkjcwVsZPrcsrAGigRiwplztMREAt807d'
asecret = 'sgfXcgpH9rTJAMdrXzm2qsf1pmG7Pp5VvLY5cV5m9TAkb'




class listener(StreamListener):
    def on_data(self, data):
        try:

            tweet = json.loads(data)

            if tweet["lang"] == "nl":
                print tweet["id"]
                # Tweets.insert(tweet)

            return True
        except BaseException, e:
            print 'failed on_date,', str(e)
            time.sleep(5)

    def on_error(self, status):
        print status


auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)
twitterStream = Stream(auth, listener())
api = API(auth)
print api.verify_credentials()
# twitterStream.filter( track=lstZoekwaarde, languages="nl" )
twitterStream.filter(track=['christmas'], languages=['nl'])