var request = require('request'),
    aprobModel = require('../models/dataAccess'),
    noView = require('../views/pagos');


var empleado = function(conf) {
    this.conf = conf || {};
    this.view = new noView();
    this.model = new aprobModel({
        parameters: this.conf.parameters
    });
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

empleado.prototype.get_empleado = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpleado', value: req.query.id, type: self.model.types.INT }
    ];

    this.model.query('SEL_EMPLEADO_SP_V2', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}



module.exports = empleado;