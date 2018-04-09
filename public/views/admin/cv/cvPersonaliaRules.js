/**
 * Created by erik on 4/9/18.
 */
function selectCategoryMenu() {
    console.info('setMenu')
    $('#search').removeClass()
    $('#home').removeClass()
    $('#category').addClass('active-menu')
    $('#sentiment').removeClass()
    $('#dictionary').removeClass()
    $('#employee').removeClass()
    $('#content').removeClass()
    $('#blog').removeClass()
}

// B. Change title and subtitle
function setCategoryTitle() {
    $('#title').html('Cattegorie instellingen')
    $('#subtitle').html('Stel hier de waarde in waarop gegroepeerd op de gevonden resultaten van uw social media kanalen')
}


//C
