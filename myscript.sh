#!/bin/bash

proces="$(pgrep -af Tweet)"

if [ -z "${proces}" ]
then 
    echo "Program stopped: TweetStreamAutoSchade.py wordt gestart...."
    python TweetStreamAutoSchade.py

else 
   echo "Program is running"
fi
