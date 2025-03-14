﻿// -- =============================================
// -- Author:      Fernando Alvarado Luna
// -- Create date: 12/03/2016
// -- Description: Controller para la autentificación del empleado
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.controller("empleadoController", function ($scope, $filter, $rootScope, localStorageService, alertFactory, empleadoRepository, $window, $routeParams) {

    //Propiedades
   
    //Funcion que carga al inicio para obtener la ficha de empleado
    $scope.init = function () {
        
        $rootScope.verlote=true;
        $rootScope.vermodal=true;
        $rootScope.verbusqueda = true;
        $rootScope.verunificacion = true;
        $rootScope.vermonitor = true;
        $rootScope.veradministracionCartera = true;
        $rootScope.veradministracionDiaDePago = true;
        $rootScope.veradministracionTipoProveedor = true;
        $rootScope.menuadministracionDiaDePago = true;
        $rootScope.menuadministracionTipoProveedor = true;
        $rootScope.menuurl = getParameterByName('idmenu')

        getEmpleado();
        
    	empleadoRepository.getFichaEmpleado($rootScope.currentEmployee)
    		.then(function successCallback(response) {

			    $rootScope.empleado = response.data;
                $rootScope.idEmpresa = $rootScope.empleado.emp_idempresa;
                alertFactory.success('Datos de empleado obtenidos.');
                getPerfila($rootScope.empleado.idPerfil);

  			}, function errorCallback(response) {
			    alertFactory.error('Error al obtener los datos de empleado.');
  			}
          );
          
          

    };

    var getEmpleado = function(){
        if(!($('#lgnUser').val().indexOf('[') > -1)){
            localStorageService.set('lgnUser', $('#lgnUser').val());
        }
        else{
            if(($('#lgnUser').val().indexOf('[') > -1) && !localStorageService.get('lgnUser')){
                if(getParameterByName('employee') != ''){
                    $rootScope.currentEmployee = getParameterByName('employee');
                    return;
                }
                else{
                    $rootScope.currentEmployee = getParameterByName('idAprobador');
                }
                
            }
        }
        //Obtengo el empleado logueado
        $rootScope.currentEmployee = localStorageService.get('lgnUser');
        //$rootScope.currentEmployee = 71;

        
    };

$scope.Salir = function () {

	alertFactory.info('exit user');

}


        var getPerfila = function(idPerfil){
           
            if ($rootScope.menuurl == ''  ) {

                if ((idPerfil == 1))
                      {
                          $rootScope.menucrear=false;
                          $rootScope.menubuscar = false;
                          $rootScope.menumonitor = false;
                          $rootScope.menuunificacion = false;
                          $rootScope.menuadministracionCartera = false;
                          $rootScope.veradministracionCartera = true;
                          $rootScope.menuadministracionDiaDePago = false;
                          $rootScope.veradministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = false;
                          $rootScope.veradministracionTipoProveedor = true;
                          $rootScope.verlote=true;
                          $rootScope.vermodal=true;
                          $rootScope.verbusqueda = true;
                          $rootScope.verunificacion = true;
                          $rootScope.vermonitor = false;
              
                      }
          
                      if ((idPerfil == 2))
                      {
                        
                          $rootScope.menucrear=true;
                          $rootScope.menubuscar = true;
                          $rootScope.menumonitor = false;
                          $rootScope.menuunificacion = false;
                          $rootScope.menuadministracionCartera = true;
                          $rootScope.veradministracionCartera = true;
                          $rootScope.menuadministracionDiaDePago = true;
                          $rootScope.veradministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = true;
                          $rootScope.veradministracionTipoProveedor = true;
                          $rootScope.verlote=true;
                          $rootScope.vermodal=true;
                          $rootScope.verbusqueda = true;
                          $rootScope.verunificacion = false;
                          $rootScope.vermonitor = true;
                
                      }
          
                      if ((idPerfil == 0))
                      {
                         
                          $rootScope.menucrear=false;
                          $rootScope.menubuscar = false;
                          $rootScope.menumonitor = true;
                          $rootScope.menuunificacion = true;
                          $rootScope.menuadministracionCartera = true;
                          $rootScope.menuadministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = true;
                          $rootScope.verlote=true;
                          $rootScope.vermodal=true;
                          $rootScope.verbusqueda = false;
                          $rootScope.verunificacion = true;
                          $rootScope.vermonitor = true;
                          $rootScope.veradministracionCartera = true;
                          $rootScope.veradministracionDiaDePago = true;
                          $rootScope.veradministracionTipoProveedor = true;
                          $rootScope.menuadministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = true;
                      }
                     }
                     else
                     {
                         if ($scope.menuurl == 1 )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = false;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
             
                         if ($scope.menuurl == 2  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=false;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
             
                         if ($scope.menuurl == 3  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = false;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
             
                         if ($scope.menuurl == 4  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = false;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
                         if ($scope.menuurl == 5  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = false;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
                        if ($scope.menuurl == 6  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = false;
                             $rootScope.veradministracionTipoProveedor = true;
                         }
                         if ($scope.menuurl == 7  )
                         {
                             $rootScope.verlote=true;
                             $rootScope.vermodal=true;
                             $rootScope.vermonitor = true;
                             $rootScope.verbusqueda = true;
                             $rootScope.verunificacion = true;
                             $rootScope.veradministracionCartera = true;
                             $rootScope.veradministracionDiaDePago = true;
                             $rootScope.veradministracionTipoProveedor = false;
                         }
         
                     if ((idPerfil == 1))
                      {
                        
                          $rootScope.menucrear=false;
                          $rootScope.menubuscar = false;
                          $rootScope.menumonitor = false;
                          $rootScope.menuunificacion = false;
                          $rootScope.menuadministracionCartera = false;
                          $rootScope.menuadministracionDiaDePago = false;
                          $rootScope.menuadministracionTipoProveedor = false;
                      }
          
                      if ((idPerfil == 2))
                      {
                        
                          $rootScope.menucrear=true;
                          $rootScope.menubuscar = true;
                          $rootScope.menumonitor = false;
                          $rootScope.menuunificacion = false;
                          $rootScope.menuadministracionCartera = true;
                          $rootScope.menuadministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = true;
                   
                      }
          
                      if ((idPerfil == 0))
                      {
                        
                          $rootScope.menucrear=false;
                          $rootScope.menubuscar = false;
                          $rootScope.menumonitor = true;
                          $rootScope.menuunificacion = true;
                          $rootScope.menuadministracionCartera = true;
                          $rootScope.menuadministracionDiaDePago = true;
                          $rootScope.menuadministracionTipoProveedor = true;
                    
                      }
                    } 
        };



}); 

