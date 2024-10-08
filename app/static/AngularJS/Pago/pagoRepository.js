var pagoUrl = global_settings.urlCORS + '/api/pagoapi/';

var pagosNodeUrl = global_settings.urlNode + 'pagosNode/';
var urlSendMail = global_settings.urlMail + 'api/devoluciones/';

registrationModule.factory('pagoRepository', function($http) {

    var dominio = document.domain;
    if (dominio == '189.204.141.196') {

        pagoUrl = pagoUrl.replace("192.168.20.89", dominio);
    }


    return {

        getprogramacionPagosNode: function(idEmpresa) {
            return $http({
                url: pagosNodeUrl + 'programacionPagosNode/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },


        getlogPagosBanamex: function(idLote) {
            return $http({
                url: pagosNodeUrl + 'logPagosBanamex/',
                method: "GET",
                params: {
                    idLote: idLote
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getDetalleLoteBanamex: function(idLote) {
            return $http({
                url: pagosNodeUrl + 'detalleLoteBanamex/',
                method: "GET",
                params: {
                    idLote: idLote
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getDetalleBitacoraPagos: function(idLote, Referencia, tipo) {
            return $http({
                url: pagosNodeUrl + 'detalleBitacoraPagos/',
                method: "GET",
                params: {
                    idLote: idLote,
                    Referencia: Referencia,
                    tipo: tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },



        getDatos: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '1|' + id }
            });
        },

        getEmpresas: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '9|' + id }
            });
        },

        getErrores: function(idEmpresa) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '27|' + idEmpresa }
            });
        },


        getTotalxEmpresa: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '10|' + id }
            });
        },

        // getliberar: function(id) {
        //     return $http({
        //         method: 'GET',
        //         url: pagoUrl,
        //         params: { id: '29|' + id }
        //     });
        // },
        getEncabezado: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '2|' + id }
            });

        },
        getParametrosEscenarios: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '20|' + id }
            });

        },
        update: function(id) {
            return $http.post(pagoUrl + '2|' + id);

        },
        setDatos: function(id, idEmpleado, idPadre, ingresos, transfer, caja, cobrar, total, operacion) {
            return $http({
                url: pagoUrl,
                method: 'POST',
                params: { id: '1|' + idEmpleado + '|' + idPadre + '|' + caja + '|' + cobrar + '|' + operacion },
                data: JSON.stringify(id) + '|' + ingresos + '|' + transfer + '|' + total
            });
        }, //LQMA
        setDatosAutoriza: function(id, idEmpleado, idPadre, ingresos, transfer, caja, cobrar, total, operacion) {
            return $http({
                url: pagoUrl,
                method: 'POST',
                params: { id: '13|' + idEmpleado + '|' + idPadre },
                data: JSON.stringify(id)
            });
        },

        procesaArchivoLogBanamex: function(id, idEmpleado) {
            return $http({
                url: pagoUrl,
                method: 'POST',
                params: { id: '15|' + idEmpleado },
                data: JSON.stringify(id)
            });
        },

        // getDatosAprob: function(id) {
        //     return $http({
        //         method: 'GET',
        //         url: pagoUrl,
        //         params: { id: '5|' + id }
        //     });

        // },
        getPagosPadre: function(idEmpresa, idEmpleado, nombreLote, idLote, esAplicacionDirecta, cifraControl) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '6|' + idEmpresa + '|' + idEmpleado + '|' + nombreLote + '|' + idLote + '|' + esAplicacionDirecta + '|' + cifraControl }
            });

        },
        getIngresos: function(idEmpresa, idLote) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '11|' + idEmpresa + '|' + idLote }
            });

        },
        getEgresos: function(idEmpresa, idLote) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '12|' + idEmpresa + '|' + idLote }
            });
        },
        getLotes: function(idEmpresa, idEmpleado, borraLote, idLote) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '13|' + idEmpresa + '|' + idEmpleado + '|' + borraLote + '|' + idLote }
            });
        },
        getTransferencias: function(idLote) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '14|' + idLote }
            });
        },
        getOtrosIngresos: function(idLote) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '15|' + idLote }
            });
        },

        //FAL 10042016 TRAE LOS BANCOS MAS COMPLETA

        getBancosCompleta: function(idEmpresa) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '19|' + idEmpresa }
            });
        },

        getBancosCompletaNode: function(idEmpresa) {
            return $http({
                url: pagosNodeUrl + 'BancosCompletaNode/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getLotesxFecha: function(idEmpresa, idUsuario, fechaini, fechafin, estatus) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '21|' + idEmpresa + '|' + idUsuario + '|' + fechaini + '|' + fechafin + '|' + estatus }
            });
        },

        getUserTransferencia: function(idUsuario) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '23|' + idUsuario }
            });
        },

        //FAL 15032016 manda el json para generar el archivo
        setArchivo: function(id, lotePadre) {

            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '4|' + id + '|' + lotePadre },
                //dataType: "json",
                //data: JSON.stringify(dataArchivo)

            });
        }, //FAL
        //LQMA
        setSolAprobacion: function(idProc, nodo, idEmpresa, idLote) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '5|' + idProc + '|' + nodo + '|' + idEmpresa + '|' + idLote }
                //dataType: "json",
                //data:JSON.stringify(dataArchivo)

            });
        },
        //LQMA
        setAprobacion: function(idProc, nodo, idEmpresa, idLote, idUsuario, idAprobador, idAprobacion, idNotify, Observacion) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '6|' + idProc + '|' + nodo + '|' + idEmpresa + '|' + idLote + '|' + idUsuario + '|' + idAprobador + '|' + Observacion + '|' + idAprobacion + '|' + idNotify }
            });
        },
        //
        UpdateCartera: function(idEmpresa) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '10|' + idEmpresa + '|0' }
            });
        },

        // LiberaDocumento: function(idLote, documento) {
        //     return $http({
        //         url: pagoUrl,
        //         method: "POST",
        //         params: { id: '14|' + idLote + '|' + documento }
        //     });
        // },

        //FAL 07062016 inserta el lote en la tabla final de aplicación
        setAplicacion: function(idEmpresa, idLote, idUsuario) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '7|' + idEmpresa + '|' + idLote + '|' + idUsuario }
            });
        }, //FAL

        setAplicacionDirecta: function(idEmpresa, idLote, idUsuario) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '11|' + idEmpresa + '|' + idLote + '|' + idUsuario }
            });
        }, //FAL

        setBorraLote: function(idLote) {
            return $http({
                url: pagoUrl,
                method: "POST",
                params: { id: '12|' + idLote }
            });
        }, //FAL

        getDatosxvencer: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '24|' + id }
            });
        },
        //FAL

        getPdf: function(tipo, annio, mes, No, empresa) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '28|' + tipo + '|' + annio + '|' + mes + '|' + No + '|' + empresa }
            });
        },

        getDatosenRojo: function(id) {
            return $http({
                method: 'GET',
                url: pagoUrl,
                params: { id: '26|' + id }
            });
        },
        getVerificaPeriodo: function(IdEmpresa, periodoAnterior) {
            return $http({
                url: pagosNodeUrl + 'verificaPeriodo/',
                method: "GET",
                params: {
                    IdEmpresa: IdEmpresa,
                    periodoAnterior: periodoAnterior
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getFechaAplicacion: function(IdLote, FechaAplicacion) {
            return $http({
                url: pagosNodeUrl + 'fechaAplicacion/',
                method: "GET",
                params: {
                    IdLote: IdLote,
                    FechaAplicacion: FechaAplicacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCorreos: function(IdEmpresa) {
            return $http({
                url: pagosNodeUrl + 'correos/',
                method: "GET",
                params: {
                    IdEmpresa: IdEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        sendMail: function(to, subject, html) {
            return $http({
                url: urlSendMail + 'sendMailCliente/',
                method: "GET",
                params: {
                    to: to,
                    subject: subject,
                    html: html
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        //FAL
        ,
        getliberar: function(idLote) {
            return $http({
                url: pagosNodeUrl + 'documentosLiberar/',
                method: "GET",
                params: {
                    idLote
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        LiberaDocumento: function(idLote, documento, idProveedores) {
            return $http({
                url: pagosNodeUrl + 'liberaDocumentos/',
                method: "POST",
                data: {
                    idLote,
                    documento,
                    idProveedores
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        cuentaAutorizadores: function(idEmpresa, cuenta) {
            return $http({
                url: pagosNodeUrl + 'cuentaAutorizadores/',
                method: "GET",
                params: {
                    idEmpresa, cuenta
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDatosAprob: function(idLote) {
            return $http({
                url: pagosNodeUrl + 'detalleLote/',
                method: "GET",
                params: {
                    idLote
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }


    };
});