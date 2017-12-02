# WisdomAsAService
WisdomAsAService draait onder Ubuntu met een minimale vereiste van 1 gigabyte
aan werkgeheugen. Middels een Python script worden Tweets opgehaald en opgeslagen
in MongoDb. 

##Requiremens
1. Python 
2. MongoDB
3. Robomongo(optioneel)
4. Export van de schema commevents

##Installatie
1. Installeer een linux variant
2. Installeer mongodb
3. importeer de export in mongodb
4. voer in de shell script de volgende commando in:
  4.1 crontab -e (en kies voor vim )
  4.2 Ga helemaal naar beneden en druk op "i"
  4.3 plak daar de volgende regel in: "* */10 * * * /home/erik/git/WisdomAsAService/myscript.sh"
5. sudo npm install -g browserify  





