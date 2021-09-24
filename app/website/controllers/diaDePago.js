var request = require('request'),
    diasModel = require('../models/dataAccess'),
    diasView = require('../views/pagos');


var dias = function(conf) {

    this.conf = conf || {};
    this.view = new diasView();

    this.model = new diasModel({
        parameters: this.conf.parameters
    });
 
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

dias.prototype.get_dias = function(req, res, next) {

    var self = this;

     var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];
   
    this.model.query('SEL_Rel_Dias', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

dias.prototype.post_insDias = function(req, res, next) {

    var self = this;

     var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT },
                   { name: 'pag_idDias', value: req.query.dia, type: self.model.types.INT }];
   
    this.model.query('INS_Rel_dias', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = dias;