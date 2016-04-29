function buildPieChart(div,data, title, width, height) {
        var pie = new d3pie(div, {
            "header": {
                "title": {
                    "text": title,
                    "fontSize": 24,
                    "font": "open sans"
                },
                "subtitle": {
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
                "canvasHeight": height ,
                "canvasWidth":  width,
                "pieOuterRadius": "90%"
            },
            "data": {
                "sortOrder": "value-desc",
                "content": data
            },
            "labels": {
                "outer": {
                    "format": "none",
                    "pieDistance": 32
                },
                "inner": {
                    "format": "label-percentage1",
                    "hideWhenLessThanPercentage": 3
                },
                "mainLabel": {
                    "color": "#e5e9e0",
                    "fontSize": 14
                },
                "percentage": {
                    "color": "#ffffff",
                    "fontSize": 15,
                    "decimalPlaces": 0
                },
                "value": {
                    "color": "#adadad",
                    "fontSize": 13
                },
                "lines": {
                    "enabled": true
                },
                "truncation": {
                    "enabled": true
                }
            },
            "effects": {
                "load": {
                    "speed": 1
                },
                "pullOutSegmentOnClick": {
                    "effect": "linear",
                    "speed": 1,
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
}
