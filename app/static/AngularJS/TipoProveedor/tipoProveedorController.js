registrationModule.controller("tipoProveedorController", function($scope, $rootScope, alertFactory,tipoProveedorRepository, pagoRepository, $filter, globalFactory) {

    $rootScope.empresas = "";
	$scope.paraProcesar = [];
	$scope.verGrid = false; 
    $('#loader').hide()
    $scope.tipo = 1

    $scope.initTipo = function () {
        $scope.getEmpresas(); 
    };


    $scope.verModal = function(){
          if($scope.paraProcesar.length > 0){
            swal({
            title: "Estás seguro?",
            text: "De guardar los elementos seleccionados!",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
            closeOnConfirm: false
            },
            function(){
            $('.busca').val('');

            if($scope.paraProcesar.length == 1)
                $scope.paraProcesar.unshift('');

            var proveedoresData = { "data":  $scope.paraProcesar,"tipo": $scope.tipo};
            
                tipoProveedorRepository.guardar(proveedoresData).then(function(result){
                    $scope.paraProcesar = [];
                    $scope.provedores = [];
                    $('#provedores').DataTable().destroy();
                    $scope.verGrid = false; 
                    $("#provedores input").prop("checked", false);  
                    $scope.getProveedores($scope.empresa.emp_idempresa);
                    if(result.data[0].success == 1)
                        swal("Listo!", "Se realizó el proceso con éxito.", "success");
                    else
                        swal("Atención!", "No se guardaron los elementos, inténtelo más tarde ...", "warning");
                });          
            });
        }else
         alertFactory.warning('Selecciona mínimo un Proveedor');
    };


    $scope.selecciona = function(elemento) {

        var valorCh = $('#ch' + elemento.idpersona)[0].checked;

        if (valorCh == true) {
             elemento.seleccionada = true;
             $scope.paraProcesar.unshift(elemento.idpersona);
        }
        else
        {
            elemento.seleccionada = false;
            var index = $scope.paraProcesar.indexOf(elemento.idpersona);
            if (index > -1) {
                $scope.paraProcesar.splice(index, 1);
            }

        }
    };

     $scope.empresaSeleccion = function(empresa) {
        $scope.verGrid = false;
        $scope.empresa = empresa;
        $scope.getProveedores($scope.empresa.emp_idempresa);
    };

 
  	$scope.getProveedores = function (idEmpresa) {
           $('#loader').show();
	    tipoProveedorRepository.getProveedores(idEmpresa)
			.then(function successCallback(response) {
                if( response.data.length > 0){
				 $scope.provedores = response.data;
				 globalFactory.filtrosTablaProvee('provedores','Proveedores',20);
                 $scope.verGrid = true; 
              
            }else{
                     alertFactory.error('No se encontraron Proveedores, inténtelo más tarde');
            }
              $('#loader').hide()
            
		}, function errorCallback(response) {
               $('#loader').hide()
			  alertFactory.error('Proveedores no disponibles, inténtelo más tarde');
		});
	};

    $scope.getEmpresas = function(){
        pagoRepository.getEmpresas($scope.idUsuario)
        .then(function successCallback(response) {
        $rootScope.empresas = response.data;
        }, function errorCallback(response) {
                    alertFactory.error('Error al traer las empresas.');
        });
    };

});