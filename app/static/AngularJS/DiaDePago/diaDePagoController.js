registrationModule.controller("diaDePagoController", function($scope, $rootScope, alertFactory,diaDePagoRepository ,pagoRepository, $filter, globalFactory) {
  
    $rootScope.empresas = "";
    $scope.verBtn = false;
    $scope.diaPago = 1;

    $scope.initDia = function () {
		$scope.getEmpresas();
    };

    $scope.guardaDia = function(){
    
        swal({
            title: "Estás seguro?",
            text: "De asignar el día de Pago!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
            closeOnConfirm: false
            },
            function(){

          	diaDePagoRepository.setDias($scope.empresa.emp_idempresa,$scope.diaPago)
					.then(function successCallback(response) {
						swal("Listo!", "Se realizó el proceso con éxito.", "success");
			}, function errorCallback(response) {
						swal("Atención!", "No se guardaron los elementos, inténtelo más tarde ...", "warning");
			});

		});
        
    };

    $scope.empresaSeleccion = function(empresa) {
        $scope.empresa = empresa;
        $scope.verBtn = true;
        $scope.getDia($scope.empresa.emp_idempresa);
    };

    $scope.getEmpresas = function(){
		pagoRepository.getEmpresas($scope.idUsuario)
		.then(function successCallback(response) {
		$rootScope.empresas = response.data;
		}, function errorCallback(response) {
		            alertFactory.error('Error al traer las empresas.');
		});
    }

     $scope.getDia = function(idEmpresa){
		diaDePagoRepository.getDias(idEmpresa)
		.then(function successCallback(response) {
            if(response.data.length > 0){
                $scope.diaPago = response.data[0].pag_idDias;
            }else{
                $scope.diaPago = 1;
            }
        }, function errorCallback(response) {
		            alertFactory.error('No se puede obtener el día.');
		});
    }


 });