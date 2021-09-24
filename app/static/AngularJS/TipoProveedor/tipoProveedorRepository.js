var tipoProvee = global_settings.urlNode + 'tipoProveedor/';

registrationModule.factory('tipoProveedorRepository', function ($http) {
    return {
        getProveedores: function (idEmpresa) {
            return $http({
                url: tipoProvee + 'proveedores/',
                method: "GET",
                params:{
                    idEmpresa:idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         guardar: function(proveedores) {
            return $http({
                url: tipoProvee + 'guardaTipos/',
                method: "POST",
                data: {
                    data: proveedores.data,
                    tipo: proveedores.tipo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});