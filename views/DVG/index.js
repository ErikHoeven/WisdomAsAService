exports.RawVault = function(req, res) {
    console.info('----------- DataVaultGenerator --------------------')
    res.render('./DVG/RawVault');

}

exports.getContent = function (req,res,next) {
    var URL = req.body.URL
}