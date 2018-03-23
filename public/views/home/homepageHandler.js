/**
 * Created by erik on 8/3/17.
 */

function menuHandler(user){
    console.info('start menu handling')
    if(jQuery.isEmptyObject(user) == true){
        console.info('user not found')
        $(".nav.navbar-nav").append('<li><a href="/">Home</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/signup/">Sign Up</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/contact/">Contact</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/events/">Events </a></li>')
    }
    else{
        console.info('user found')
        $(".nav.navbar-nav").append('<li><a href="/contact/">Contact</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/events/">Events </a></li>')
        $(".nav.navbar-nav").append('<li><a href="/BusinessRules/">Zoekmachine</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/Dashboard/">Dashboard</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/upload/">upload</a></li>')
        $(".nav.navbar-nav").append('<li><a href="/admin/">Admin</a></li>')
    }

}

function loginHander(user){
    console.info('start loginHander handling')
    if(jQuery.isEmptyObject(user) == true){
        console.info('user not found')
        $('.nav.navbar-nav.navbar-right').append('<a href="/login" class="btn btn-info btn-sm" ><span class="glyphicon glyphicon-user"></span> Login</a>')
    }
    else{
        console.info('user found')
        $('.nav.navbar-nav.navbar-right').append('<a href="/logout" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-log-out"></span> Log out</a>')
    }
}