var request = require('request'),
    aprobModel = require('../models/dataAccess'),
    noView = require('../views/pagos');


var pagosNode = function(conf) {
    this.conf = conf || {};
    this.view = new noView();

    this.model = new aprobModel({
        parameters: this.conf.parameters
    });
    /*if (conf) {
        this.url = this.conf.parameters.server + "cargaapi/"
    }*/
    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

pagosNode.prototype.get_programacionPagosNode = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING }
    ];


    this.model.query('SEL_PROGRAMACION_PAGOS_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.get_proPagosguardado = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idPadre', value: req.query.idPadre, type: self.model.types.STRING }
    ];


    this.model.query('SEL_PROG_PAGOS_GUARDADA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.get_BancosCompletaNode = function(req, res, next) {

    var self = this;

    var params = [{ name: 'idEmpresa', value: req.query.idEmpresa, type: self.model.types.STRING }
    ];


    this.model.query('SEL_TOTAL_BANCOS_P_NP_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.post_insertaLote = function(req, res, next) {

    var self = this;

    var params = [{ name: 'IdCartera', value: req.body.idCartera, type: self.model.types.STRING },
        { name: 'IdEmpresa', value: req.body.idEmpresa, type: self.model.types.STRING },
        { name: 'FechaPromPago', value: req.body.fechaPromesa, type: self.model.types.STRING },
        { name: 'AnioCartera', value: req.body.anioCartera, type: self.model.types.STRING }

    ];


    this.model.query('UPD_CARTERA_FECHAPROMPAGO_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.get_logPagosBanamex = function(req, res, next){
    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.STRING }];
   //console.log("en pagos banamex", req.query.idLote);
    this.model.query('SEL_PAG_LOG_BANAMEX', params, function(error,  result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.get_detalleBitacoraPagos = function(req, res, next){
    var self = this;

    var params = [{ name: 'idLote', value: req.query.idLote, type: self.model.types.STRING },
    { name: 'Referencia', value: req.query.Referencia, type: self.model.types.STRING },
    { name: 'tipo', value: req.query.tipo, type: self.model.types.STRING }];
   // console.log("en bitacora pagos", req.query.idLote + ' ' + req.query.Referencia + ' ' + req.query.tipo);
    this.model.query('SEL_DETALLES_PAGOS_BITACORA', params, function(error,  result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

pagosNode.prototype.get_detalleLoteBanamex = function(req, res, next){
    var self = this;
    var params = [{ name: 'idLotePago', value: req.query.idLote, type: self.model.types.STRING }];
    console.log("en detalles banamex", req.query.idLote);
    this.model.query('SEL_DETALLES_PAGOS_CUENTA', params, function(error,  result){
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


module.exports = pagosNode;