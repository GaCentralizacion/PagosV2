var diaDePago = global_settings.urlNode + 'diaDePago/';

registrationModule.factory('diaDePagoRepository', function ($http) {
    return {
        getDias: function (idEmpresa) {
            return $http({
                url: diaDePago + 'dias/',
                method: "GET",
                params:{
                    idEmpresa:idEmpresa
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        setDias: function (idEmpresa,dia) {
            return $http({
                url: diaDePago + 'insDias/',
                method: "POST",
                params:{
                    idEmpresa:idEmpresa,
                    dia:dia
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});