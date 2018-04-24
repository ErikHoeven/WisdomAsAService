/**
 * Created by erik on 4/23/18.
 */
// START PROGRAM
exports.init = function(req, res) {
    console.info('----------- Consultancy --------------------')
    res.render('Consultancy/Consultancy');

}

exports.getContent = function (req,res,next) {
    var URL = req.body.URL
}