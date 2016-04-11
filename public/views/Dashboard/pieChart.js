$(document).ready(function() {
    var pie = new d3pie("pieChart", {
        "header": {
            "title": {
                "text": "Tweets per cattegorie",
                "fontSize": 24,
                "font": "open sans"
            },
            "subtitle": {
                "text": "Tweets per cattegorie",
                "color": "#999999",
                "fontSize": 12,
                "font": "open sans"
            },
            "titleSubtitlePadding": 9
        },
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
        },
        "size": {
            "canvasHeight": 400,
            "canvasWidth": 400,
            "pieInnerRadius": "39%",
            "pieOuterRadius": "90%"
        },
        "data": {
            "sortOrder": "value-desc",
            "smallSegmentGrouping": {
                "enabled": true,
                "value": 8,
                "valueType": "value"
            },
            //To DO JSON
            "content": tweetsPerCattegorry
               /* [
                {
                    "label": "JavaScript",
                    "value": 264131,
                    "color": "#2484c1"
                },
                {
                    "label": "Ruby",
                    "value": 218812,
                    "color": "#97910b"
                },
                {
                    "label": "Java",
                    "value": 157618,
                    "color": "#4daa4b"
                },
                {
                    "label": "PHP",
                    "value": 114384,
                    "color": "#c46883"
                }
            ]*/
        },
        "labels": {
            "outer": {
                "pieDistance": 32
            },
            "inner": {
                "hideWhenLessThanPercentage": 7
            },
            "mainLabel": {
                "fontSize": 11
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": true
            },
            "truncation": {
                "enabled": true
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            }
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            }
        }
    });

});