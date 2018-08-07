/**
 * Created by erik on 4/23/18.
 */
// START PROGRAM
exports.init = function(req, res) {
    console.info('----------- Products/Data Warehouse Accelerator --------------------')
    res.render('Products/DWA');

}

exports.getContent = function (req,res,next) {
    var URL = req.body.URL
}