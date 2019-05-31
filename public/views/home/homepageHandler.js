
function menuHandler(user){
    console.info('start menu handling')
    if(jQuery.isEmptyObject(user) == true){
        console.info('user not found')
        $(".nav.navbar-nav").append('<li><a href="/signup/">Registreren</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/contact/">Contact</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/events/">Blogs </a></li>')
        $(".nav.navbar-nav").append('<li><a href="/PowerBI/">PowerBI </a></li>')
    }
    else{
        console.info('user found')
        $(".nav.navbar-nav").append('<li><a href="/contact/">Contact</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/events/">Blogs </a></li>')
        $(".nav.navbar-nav").append('<li><a href="/BusinessRules/">Zoekmachine</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/Dashboard/">Agile Dashboard</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/Smarthome/">Smarthome Dashboard</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/upload/">upload</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/admin/">Admin</a></li>')
    }
}

function loginHander(user){
    console.info('start loginHander handling')
    if(jQuery.isEmptyObject(user) == true){
        console.info('Login user not found')
        $(".nav.navbar-nav").append('<li><a href="/login/">Aanmelden</a></li>')
    }
    else{
        console.info('user found')
        $(".nav.navbar-nav").append('<li><a href="/logout/">Afmelden </a></li>')
    }
}