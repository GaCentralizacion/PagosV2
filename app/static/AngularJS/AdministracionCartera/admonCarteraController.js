registrationModule.controller("admonCarteraController", function($scope, $rootScope, admonCarteraRepository, unificacionRepository, alertFactory, $filter, globalFactory) {
    $scope.empresaSeleccion = function(empresa) {
        $scope.empresa = empresa;
    };
    $rootScope.busqueda = function(id, nombre) {
        admonCarteraRepository.obtieneProveedor(id, nombre, '', $scope.empresa.emp_idempresa).then(function(result) {
            $rootScope.clientes = result.data;
            globalFactory.tableBasica('proveedores');
            // setTimeout(function() {
            //     $('#proveedores').DataTable();
            // }, 100);
        });
    };
    $scope.modalBusqueda = function() {
        $('#modalAdmoCuentas').modal('show')
    };
    $scope.proveedor = function(cliente) {
        $('#modalAdmoCuentas').modal('hide')
        $rootScope.cliente = cliente;
    };
    $scope.buscaCartera = function() {
        admonCarteraRepository.getCartera($scope.empresa.emp_idempresa, $rootScope.cliente.idProveedor).then(function(result) {
            $scope.carteras = result.data;

            if ($scope.selectedAll) {
                if ($scope.selectedAll.length > 0) {
                    $scope.carteras = $scope.carteras.filter(obj => {
                        const exists = $scope.selectedAll.some(obj2 => (
                            obj2.pbp_consCartera === obj.pbp_consCartera
                        ));
                        if (exists) {
                            return obj.unSelect = true;
                        } else {
                            return obj;
                        }
                    });
                }
            }
            globalFactory.filtrosTabla('carteras', 'CARTERA', 10);
        });
    };
    $scope.cambiarFecha = function() {

        var selectedRows = $filter("filter")($scope.carteras, {
            seleccionada: true
        }, true);
        var seleccionR = '';
        $scope.selectedRows = selectedRows;
        if (!$scope.selectedAll) {
            $scope.selectedAll = $scope.selectedRows;
        } else {
            angular.forEach($scope.selectedRows, function(value, key) {
                seleccionR = $scope.selectedAll.find(cartera);

                function cartera(car) {
                    return car.pbp_consCartera == value.pbp_consCartera;
                };
                if (!seleccionR) {
                    $scope.selectedAll.push(value)
                }
                seleccionR = '';

            });
        }
        var fechaProm = $scope.fechaPromesa.format("dd/mm/yyyy");

        var hoy = new Date();
        var month = hoy.getMonth();
        var day = hoy.getDate();
        var year = hoy.getFullYear();
        var fechaActual =new Date(year,month,day,0,0,0);
        if ($scope.fechaPromesa < fechaActual) {
            alertFactory.warning("Debe seleccionar una fecha mayor al dia de hoy");

        } else {
            if ($scope.selectedRows.length === 0) {
                alertFactory.warning("Debe seleccionar al menos un registro");
            } else {
                angular.forEach($scope.selectedRows, function(value, key) {
                    admonCarteraRepository.pushCartera(value.pbp_consCartera, $scope.empresa.emp_idempresa, fechaProm, value.pbp_polAnnio).then(function(result) {

                        $scope.respuesta = result.data[0];
                    });
                });
                setTimeout(function() {
                    alertFactory.success("Se realizó la operación correctamente ");
                    $scope.buscaCartera();
                }, 1000)
            }
        }
    };
    $scope.SeleccionarTodo = function() {
        if ($scope.seleccionarTodo == true) {
            var table = $('#carteras').DataTable();
            var rowss = table.rows({ search: 'applied' }).data();
            var cartera = '';
            angular.forEach(rowss, function(value, key) {
                cartera = value[0];
                angular.forEach($scope.carteras, function(value, key) {
                    if (value.pbp_consCartera == cartera) {
                        value.seleccionada = true;
                    }
                });

            });
        } else if ($scope.seleccionarTodo == false) {
            angular.forEach($scope.carteras, function(value, key) {
                value.seleccionada = false;
            });
        }
        console.log($scope.carteras);
    };
    $scope.select = function(item) {
        item.seleccionada == false || item.seleccionada == undefined ? item.seleccionada = true : item.seleccionada = false;
    }
});