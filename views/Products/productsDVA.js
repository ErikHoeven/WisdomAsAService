/**
 * Created by erik on 4/23/18.
 */
// START PROGRAM
exports.init = function(req, res) {
    console.info('----------- Products/Data Vault Accelerator --------------------')
    res.render('Products/DVA');

}

exports.getContent = function (req,res,next) {
    var URL = req.body.URL
}