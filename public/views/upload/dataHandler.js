/**
 * Created by erik on 2/5/17.
 */

function searchData (readFile, names) {
    // Autocompletion
    if(readFile == 1){
        $('#displayReadedDataSectie').append('<p></p><h3>DATA IS INGELEZEN</h3></p><br>')
        $('#displayReadedDataSectie').append('<label for="searchDataSectie">searchDataSectie: </label>')
        $('#displayReadedDataSectie').append('<input id="searchDataSectie">')

        var accentMap = {
            "á": "a",
            "ö": "o"
        };
        var normalize = function( term ) {
            var ret = "";
            for ( var i = 0; i < term.length; i++ ) {
                ret += accentMap[ term.charAt(i) ] || term.charAt(i);
            }
            return ret;
        };

        $( "#searchDataSectie" ).autocomplete({
            source: function( request, response ) {
                var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( names, function( value ) {
                    value = value.label || value.value || value;
                    return matcher.test( value ) || matcher.test( normalize( value ) );
                }) );
            }
        });
    }
return 0
}

function translateSearchResult(searchWord) {

}
