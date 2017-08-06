/**
 * Created by erik on 8/6/17.
 */
function setMachtingTweets(tweets) {
    $('#Tweets').append('<div class="col-md-6 bg-twitter padding-bottom-38 text-center"> ' +
        '<div class="text-center">' +
        '<p class="pull-left margin-top-20">' +
        '<i class="fa fa-twitter fa-4x"></i>' +
        '</p>' +
        '<div class="social-overview">' +
        '<span class="font-size-40 counter font-bold text-left">' + tweets + '</span>' +
        '<p class="margin-left-50 text-left">Matching tweets</p>' +
        '</div></div></div>')
}

function setUserProfile(user) {
    console.info('setUserProfile')
    var url = user.profilePictureURI
    console.info(url)
    if (!url) {
        url = '/images/users/img2.jpg'
    }

    $('#userprofile').append('<img src="' + url + '" class="img-circle profile-avatar" alt="User avatar">')

}


