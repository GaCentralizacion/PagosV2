var admonCarteraUrl = global_settings.urlNode + 'admonCartera/';

registrationModule.factory('admonCarteraRepository', function($http) {
    return {
        getCartera: function(idEmpresa, idProveedor) {
            return $http({
                url: admonCarteraUrl + 'cartera/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idProveedor: idProveedor
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        pushCartera: function(idCartera,idEmpresa, fechaPromesa, anioCartera) {
            return $http({
                url: admonCarteraUrl + 'pushCartera/',
                method: "POST",
                data: {
                    idEmpresa: idEmpresa,
                    idCartera: idCartera,
                    fechaPromesa: fechaPromesa,
                    anioCartera: anioCartera
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneProveedor: function(id, nombre, rfc, idEmpresa) {
            return $http({
                url: admonCarteraUrl + 'proveedor/',
                method: "GET",
                params: {
                    id: id,
                    nombre: nombre,
                    rfc: rfc,
                    idEmpresa: idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});