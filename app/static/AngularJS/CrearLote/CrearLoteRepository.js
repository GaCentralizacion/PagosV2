var CrearLoteUrl = global_settings.urlCORS + '/api/pagoapi/';

registrationModule.factory('CrearLoteRepository', function ($http) {
    return {
         getCuentas: function (id, lote) {
        return $http({
            method: 'GET',
            url: pagoUrl,
            params: { id: '17|' + id + '|' + lote}
         });
        }
    };
});