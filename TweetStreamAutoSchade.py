from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import time
import json
from pymongo import MongoClient
from datetime import datetime


#Mongo Settings
client = MongoClient()
db = client.commevents
Tweets = db.STG_LEADS_AUTOSCHADE
searchList = db.businessrules

#Twitter Credentials
ckey ='s9eO9Ftuy42cgTkUetOzukbX9' 
csecret ='QpzB5NCKeoqKOLYkncJyvpA4ZE2oeY751kyvilzs7hCczJoaE9'
atoken = '169505005-l7IoKI6PkjcwVsZPrcsrAGigRiwplztMREAt807d'
asecret = 'sgfXcgpH9rTJAMdrXzm2qsf1pmG7Pp5VvLY5cV5m9TAkb'

#Haal zoekwaarde op uit MongoDB
jsonSearchList = searchList.find({"typeBusinessRule":"Zoekwaarde"})
lstZoekwaarde = []

for Zoekwaarde in jsonSearchList:
    lstZoekwaarde.append(Zoekwaarde["lookupValue"])

class listener(StreamListener):

    def on_data(self, data):
        try:  
                          
            tweet = json.loads(data)
            
            if tweet["lang"] == "nl":
                print tweet["id"]

                #print tweet["created_at"]
                created_at =  tweet["created_at"][:-10] + tweet["created_at"][26:]
                created_at =  datetime.strptime(created_at,"%a %b %d %H:%M:%S %Y")
                created_at = datetime.strftime(created_at,"%m/%d/%Y %H:%M:%S")
                created_at = datetime.strptime(created_at,"%m/%d/%Y %H:%M:%S")
                print created_at
                tweet["created_at"] =  created_at
                Tweets.insert(tweet)

            
            

            return True
        except BaseException, e:
            print 'failed on_date,', str(e)
            time.sleep(5)
                
    def on_error(self, status):
        print status

auth = OAuthHandler(ckey, csecret)
auth.set_access_token(atoken, asecret)
twitterStream = Stream(auth, listener())
# twitterStream.filter( track=lstZoekwaarde, languages="nl" )
twitterStream.filter( track=lstZoekwaarde, languages=['nl','en'] )

