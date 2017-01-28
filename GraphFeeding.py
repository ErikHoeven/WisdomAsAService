import pandas as pd
import nltk
from pymongo import MongoClient


#Mongo Settings
client = MongoClient()
db = client.commevents
corpus = db.corpus
businessrules = db.businessrules

def WordInCorpus (token, corpus)
    if token
