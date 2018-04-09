/**
 * Created by erik on 4/9/18.
 */
function selectCVMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').removeClass()
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
    $('#cvBuilder').addClass('active-menu')
}

// B. Change title and subtitle
function setCVitle() {
    $('#title').html('CV Beheren')
    $('#subtitle').html('Zoek je CV en beheer')
}

