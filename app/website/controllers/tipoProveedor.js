var request = require('request'),
    tipoModel = require('../models/dataAccess'),
    tipoView = require('../views/pagos'),
    jsonxml = require('jsontoxml');


var tipos = function(conf) {

    this.conf = conf || {};
    this.view = new tipoView();

    this.model = new tipoModel({
        parameters: this.conf.parameters
    });
 
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

tipos.prototype.get_proveedores = function(req, res, next) {

    var self = this;
    
     var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.INT }];
 
    this.model.query('SEL_Rel_TipoProveedor', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
};

tipos.prototype.post_guardaTipos = function(req, res, next) {

        var self = this;

        for (var i = 0; i < req.body.data.length; i++) {
           if(req.body.data[i]!= ''){
            req.body.data[i] = { id: req.body.data[i] }
            req.body.data[i] = { proveedor: req.body.data[i] }
            }
        };

         var params = [ { name: 'proveedores', value: jsonxml({ proveedores: req.body.data }), type: self.model.types.XML},
                        { name: 'pag_idtipoProveedor', value: req.body.tipo, type: self.model.types.INT } ];

            self.model.query('UPD_Rel_TipoProveedor', params, function(error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
};


module.exports = tipos;