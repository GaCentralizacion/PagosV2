registrationModule.controller("CrearLoteController", function ($scope, $rootScope,uiGridGroupingConstants, uiSortableMultiSelectionMethods, alertFactory, CrearLoteRepository, pagoRepository) {
    $scope.radioTotales = 1;
    $scope.formData = {};
    $scope.init = function () {
        console.log($rootScope.currentEmployee)
        var element = document.getElementById("st-container");
        element.classList.remove("st-menu-open");
        $scope.traeEmpresas();
    }
    $scope.traeTotalxEmpresa = function (emp_idempresa, emp_nombre, emp_nombrecto, rfc, tipo, pagoDirecto, monto_minimo) {
        $('#btnTotalxEmpresa').button('loading');
        $scope.showTotales = 0;
        //fal22052019
        // $scope.bancoPago.cuenta = '';
        $scope.showSelCartera = false;
        //LQMA 14042016
        $scope.emp_nombrecto = emp_nombrecto;
        $scope.rfc = rfc;
        $scope.montominimo = monto_minimo;
        $scope.LlenaEgresos(emp_idempresa, 0);
        pagoRepository.getTotalxEmpresa(emp_idempresa)
            .then(function successCallback(response) {

                $scope.GranTotal = 0;
                $scope.TotalxEmpresas = response.data;
                $rootScope.idEmpresa = emp_idempresa;
                i = 0;
                $scope.TotalxEmpresas.forEach(function (cuentaPagadora, sumaSaldo) {
                    $scope.GranTotal = $scope.GranTotal + $scope.TotalxEmpresas[i].sumaSaldo;
                    i++;
                });
                $scope.traeTotalxEmpresa.emp_nombre = emp_nombre;
                $scope.showTotales = 1;
                $scope.tipoEmpresa = tipo;
                $scope.pagoDirecto = pagoDirecto;
                $scope.showSelCartera = true;
                $scope.buscarLotes = true;
                $scope.ObtieneLotes(0);
                $('#btnTotalxEmpresa').button('reset');
                $scope.llenaParametroEscenarios();

                $scope.traeBancosCompleta();


            }, function errorCallback(response) {
                //oculta la información y manda el total a cero y llena el input del modal
                $scope.TotalxEmpresas = [];
                $scope.GranTotal = 0;
                // $scope.showGrid = false;
                $scope.showSelCartera = false;
                $scope.showTotales = 0;
                $scope.traeTotalxEmpresa.emp_nombre = 'La empresa seleccionada no tiene información';
                $('#btnTotalxEmpresa').button('reset');
            });

    };
    $scope.traeEmpresas = function () {
        // $scope.showGrid = false;
        pagoRepository.getEmpresas($rootScope.currentEmployee)
            .then(function successCallback(response) {
                $scope.empresas = response.data;
                //
                $scope.showTotales = 0;
            }, function errorCallback(response) {
                alertFactory.error('Error en empresas.');
            });

    }
    $scope.LlenaEgresos = function (idempresa, lote) {
        pagoRepository.getEgresos(idempresa, lote)
            .then(function successCallback(response) {
                $scope.egresos = response.data;
                angular.forEach($scope.grdBancos, function (empresa, key) {


                    angular.forEach($scope.egresos, function (egreso, key) {
                        if (empresa.cuentaPagadora == egreso.cuenta)
                            egreso.totalPagar = empresa.subtotal;
                    });
                });
                angular.forEach($scope.egresos, function (egreso, key) {
                    angular.forEach($scope.ingresos, function (ingreso, key) {
                        if (ingreso.cuenta == egreso.cuenta)
                            egreso.ingreso = 1;
                    });
                });
                $scope.calculaTotalOperaciones();
                // recalculaIngresos();
            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los Egresos');
            });
    };
    $scope.calculaTotalOperaciones = function () {

        var totalDestino = 0;
        angular.forEach($scope.transferencias, function (transferencia, key) {
            totalDestino = totalDestino + parseInt(transferencia.importe);
        });
        $scope.egresos[0].aTransferir = totalDestino;

    };
    $scope.ObtieneLotes = function (newLote) //borraLote, 0 para borrar lotes sin relacion, 1 para conservarlos
    {
        var date = new Date();
        pagoRepository.getLotes($rootScope.idEmpresa, $rootScope.currentEmployee, 0, 0)
            .then(function successCallback(data) {
                var EsPagoDirecto = 0;
                if ($scope.selPlantaBanco) {
                    EsPagoDirecto = 1;
                }

                $scope.noLotes = data;
                if (newLote != 0) {
                    $scope.noLotes.data.push(newLote);
                    $scope.estatusLote = 0;
                }
                if ($scope.noLotes.data.length > 0) //mostrar boton crear lote
                {
                    alertFactory.success('Total de lotes: ' + $scope.noLotes.data.length);
                    $scope.idLotePadre = $scope.noLotes.data[$scope.noLotes.data.length - 1].idLotePago;
                    $scope.estatusLote = $scope.noLotes.data[$scope.noLotes.data.length - 1].estatus;
                    $scope.ConsultaLote($scope.noLotes.data[$scope.noLotes.data.length - 1], $scope.noLotes.data.length, 0, EsPagoDirecto);
                    $scope.formData.nombreLoteNuevo = ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getFullYear() + '-' + $scope.rfc + '-' + ('0' + ($scope.noLotes.data.length + 1)).slice(-2); //data.length + 1;
                    $scope.NuevoLote = true;
                    $scope.ProgPago = true;

                } else {
                    //alertFactory.info('No existen Lotes');
                    $scope.NuevoLote = true;
                    $scope.formData.nombreLoteNuevo = ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getFullYear() + '-' + $scope.rfc + '-' + ('0' + ($scope.noLotes.data.length + 1)).slice(-2); //data.length + 1;
                }
            },
                function errorCallback(response) {
                    alertFactory.error('Error al obtener los Lotes');
                });
    };
    $scope.llenaParametroEscenarios = function () {
        pagoRepository.getParametrosEscenarios($scope.tipoEmpresa)
            .then(function successCallback(response) {
                $scope.escenarios = response.data;
                $scope.pdPlanta = $scope.escenarios.Pdbanco;
                $scope.pdBanco = $scope.escenarios.Pdplanta;
                $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
                $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
                if ($scope.pdPlanta || $scope.pdBanco) {
                    $scope.selPagoDirecto = true;
                } else {
                    $scope.selPagoDirecto = false;
                }
            }, function errorCallback(response) {
                alertFactory.error('Error al obtener los parametros del escenario de pagos.');
            });
    };
    $scope.traeBancosCompleta = function () {
        //Llamada a repository para obtener data
        //FAL 10042016
        $scope.grdBancos = [];
        $scope.grdBancosoriginal = [];
        pagoRepository.getBancosCompletaNode($rootScope.idEmpresa)
            .then(function successCallback(response) {
                $scope.bancosCompletas = response.data;
                $scope.GranTotalaPagar = 0;
                $scope.GranTotalnoPagable = 0;
                $scope.GranTotalPagable = 0;
                i = 0;
                $scope.bancosCompletas.forEach(function (cuentaPagadora, sumaSaldo) {
                    $scope.GranTotalaPagar = $scope.GranTotalaPagar + $scope.bancosCompletas[i].sumaSaldo;
                    $scope.GranTotalnoPagable = $scope.GranTotalnoPagable + $scope.bancosCompletas[i].sumaSaldoNoPagable;
                    $scope.GranTotalPagable = $scope.GranTotalPagable + $scope.bancosCompletas[i].sumaSaldoPagable;
                    i++;
                });
                $scope.grdBancosoriginal = $scope.grdBancos;
            }, function errorCallback(response) {
                alertFactory.error('Error en bancos con todos sus saldos.');
            });

        // Calcula la fecha para e periodo anterior
        var today = new Date();
        var aux
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = '01-' + mm + '-' + yyyy;
        $scope.fechaPasada = $scope.editar_fecha(today, '-1', 'm', '-', '');
        pagoRepository.getVerificaPeriodo($rootScope.idEmpresa, $scope.fechaPasada).then(function (result) {
            $scope.StatusPeriodo = result.data[0].Status;
        });
    };
    $scope.editar_fecha = function (fecha, intervalo, dma, separador, separadorSalida) {
        var separador = separador || "-";
        var arrayFecha = fecha.split(separador);
        var dia = arrayFecha[0];
        var mes = arrayFecha[1];
        var anio = arrayFecha[2];

        var fechaInicial = new Date(anio, mes - 1, dia);
        var fechaFinal = fechaInicial;
        if (dma == "m" || dma == "M") {
            fechaFinal.setMonth(fechaInicial.getMonth() + parseInt(intervalo));
        } else if (dma == "y" || dma == "Y") {
            fechaFinal.setFullYear(fechaInicial.getFullYear() + parseInt(intervalo));
        } else if (dma == "d" || dma == "D") {
            fechaFinal.setDate(fechaInicial.getDate() + parseInt(intervalo));
        } else {
            return fecha;
        }
        dia = fechaFinal.getDate();
        mes = fechaFinal.getMonth() + 1;
        anio = fechaFinal.getFullYear();

        dia = (dia.toString().length == 1) ? "0" + dia.toString() : dia;
        mes = (mes.toString().length == 1) ? "0" + mes.toString() : mes;

        return anio + separadorSalida + mes + separadorSalida + dia;
    }
    $scope.selBancoPago = function (egreso, transferencia) {
        $scope.bancoPago = egreso;
    };
    $scope.IniciaLote = function () {
        $scope.crearLote = true;
        $scope.selPlantaBanco = false;
        if ($scope.formData.nombreLoteNuevo == null) {
            alertFactory.warning('Debe proporcionar el nombre del nuevo lote.');
            $('#btnCrealote').button('reset');
        } else {
            $scope.gridOptions = null;
            $scope.gridXvencer = null;
            $scope.gridenRojo = null
            ConfiguraGrid();
            $scope.NuevoLote = true;
            $scope.btnactualizar = 'Guardar';
            pagoRepository.getprogramacionPagosNode($rootScope.idEmpresa)
                .success(getCarteraCallback)
                .error(errorCallBack);
        }
        $rootScope.verlote = false;
        $rootScope.vermodal = true;
        $rootScope.verbusqueda = true;
        $rootScope.vermonitor = true;
        $rootScope.verunificacion = true;
        $('#btnCrealote').button('Crear Lote');
    };
    var errorCallBack = function(data, status, headers, config) {
        alertFactory.error('Ocurrio un problema');
    };
    var getCarteraCallback = function(data, status, headers, config) {
        //FAL fecha no presentada y contadores
        $scope.data = data;
        $scope.carteraVencida = 0;
        $scope.cantidadTotal = 0;
        $scope.cantidadUpdate = 0;
        $scope.noPagable = 0;
        $scope.Reprogramable = 0;
        $scope.TotalSaldoPagar = 0;
        var contador = 1;

        $scope.pdPlanta = $scope.escenarios.Pdplanta;
        $scope.pdBanco = $scope.escenarios.Pdbanco;
        $scope.refPlanta = $scope.escenarios.TipoRefPlanta;
        $scope.refpdBanco = $scope.escenarios.tipoRefBanco;
        $scope.grdPagoDirecto = [];
        var j = 0;
        var tamdata = $scope.data.length;
        for (var i = 0; i < tamdata; i++) {


            $scope.TotalSaldoPagar = $scope.TotalSaldoPagar + $scope.data[i].saldo;
            $scope.data[i].Pagar = $scope.data[i].saldo;
            $scope.data[i].fechaPago = $scope.data[i].fechaPromesaPago;
            $scope.data[i].agrupar = 0;



            if ($scope.data[i].fechaPromesaPago == "1900-01-01T00:00:00") {
                $scope.data[i].fechaPromesaPago = "";
            }

            //FAL 23052016 dependiendo la lista de 
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 7) {
                    $scope.data[i].referencia = 'Planta';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                } else {
                    $scope.data[i].referencia = '';
                }
            }
            if ($scope.pdPlanta) {
                if ($scope.data[i].idProveedor == 6) {
                    $scope.data[i].referencia = 'Financiera';
                    var datadirecto = $scope.data[i];
                    $scope.grdPagoDirecto.push(datadirecto);
                }
            }
            if ($scope.pdBanco) {
                if ($scope.data[i].esBanco == 'true') {
                    $scope.data[i].referencia = 'Banco';
                }
            }

            if ($scope.data[i].seleccionable == "False") {
                $scope.data[i].estGrid = 'Pago';
            }

            if ($scope.data[i].seleccionable == 'True') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
                $scope.data[i].estGrid = 'No pagar';
            }

            if ($scope.data[i].documentoPagable == 'False') {
                $scope.data[i].Pagar = $scope.data[i].saldo;
            }

            // if (($scope.data[i].numeroSerie).length == 17) {
            //     $scope.data[i].referencia = $scope.data[i].numeroSerie.substring(9, 17);
            // }

            if (($scope.data[i].autorizado == 1) && ($scope.data[i].seleccionable == "False")) {
                $scope.data[i].seleccionable = 'False';
            } else {
                $scope.data[i].seleccionable = 'True';
            }

            if ($scope.data[i].convenioCIE === '') {
                $scope.data[i].agrupar = 0;
            } else {
                $scope.data[i].seleccionable == "False";
                $scope.data[i].estGrid = 'Pago';
            }

            $scope.data[i].agrupar = 0;
            $scope.data[i].numagrupar = i;
            //FAL17052016 Valido si lleva numero de serie y si es de lenght = 17 lo pango en referencia.
            $scope.carteraVencida = $scope.carteraVencida + $scope.data[i].saldo;


        }
        $scope.noPagable = $scope.carteraVencida - $scope.cantidadTotal;

        //FAL 20062016 separación de cartera en caso de pago directo

        if ($scope.selPlantaBanco) {

            $scope.datosModal = $scope.grdPagoDirecto;

        } else {
            $scope.datosModal = $scope.data;

        }

        var newLote = { idLotePago: '0', idEmpresa: $rootScope.idEmpresa, idUsuario: $rootScope.currentEmployee, fecha: '', nombre: $scope.formData.nombreLoteNuevo, estatus: 0 };
        $scope.ObtieneLotes(newLote);
        $scope.LlenaIngresos();
        $scope.estatusLote = 0;
        //LQMA 15032016
        $scope.accionPagina = true;
        $scope.grdApagar = 0;
        //FAL 19042016 llena totales de bancos desde la consulta
        $scope.grdBancos = [];
        $scope.grdApagar = 0;
        $scope.bancosCompletas.forEach(function(banco, k) {
            $scope.grdBancos.push({
                banco: banco.cuentaPagadora,
                subtotalLote: 0,
                subtotal: banco.sumaSaldoPagable
            });
            $scope.grdApagar = $scope.grdApagar + banco.sumaSaldoPagable;
        });
        $scope.blTotales = true;
        $scope.idOperacion = 0;
        //FAL grid  x vencer


    };
    var ConfiguraGrid = function() {

        $scope.idEmpleado = $rootScope.currentEmployee;
        $scope.gridOptions = {
            enableColumnResize: true,
            enableRowSelection: true,
            enableGridMenu: true,
            enableFiltering: true,
            enableGroupHeaderSelection: true,
            treeRowHeaderAlwaysVisible: false,
            showColumnFooter: false,
            showGridFooter: false,
            height: 900,
            cellEditableCondition: function($scope) {
                return $scope.row.entity.seleccionable;
            },
            isRowSelectable: function(row) {
                if (row.entity.seleccionable == "True") return false; //rirani is not selectable
                return true; //everyone else is
            },
            columnDefs: [{
                    name: 'nombreAgrupador',
                    grouping: { groupPriority: 0 },
                    sort: { priority: 0, direction: 'asc' },
                    width: '15%',
                    displayName: 'Grupo',
                    enableCellEdit: false,
                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
                }, {
                    name: 'proveedor',
                    grouping: { groupPriority: 1 },
                    sort: { priority: 1, direction: 'asc' },
                    width: '40%',
                    displayName: 'Proveedor',
                    enableCellEdit: false,
                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>'
                },
                { name: 'idProveedor', displayName: 'Clave', width: '5%', enableCellEdit: false, headerTooltip: 'Nombre del provedor', cellClass: 'cellToolTip' }, ,
                {
                    name: 'saldo',
                    displayName: 'Saldo',
                    width: '15%',
                    cellFilter: 'currency',
                    enableCellEdit: false,
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function(aggregation) {
                        aggregation.rendered = aggregation.value
                    }
                },
                { name: 'documento', displayName: '# Documento', width: '15%', enableCellEdit: false, headerTooltip: 'Documento # de factura del provedor', cellClass: 'cellToolTip', cellTemplate: '<div style="text-align: center;"><span align="center"><a class="urlTabla" href ng-click="grid.appScope.VerDocumento(row.entity)">{{row.entity.documento}}</a></span></div>' },
                {
                    name: 'agrupar',
                    field: 'agrupar',
                    displayName: 'No agrupar',
                    width: '8%',
                    type: 'boolean',
                    cellTemplate: '<input type="checkbox" ng-model="row.entity.agrupar">'
                },
                { name: 'ordenCompra', displayName: 'Orden de compra', width: '13%', enableCellEdit: false, cellTemplate: '<div class="urlTabla" ng-class="col.colIndex()" ><a tooltip="Ver en digitalización" class="urlTabla" href="http://192.168.20.89:3200/?id={{row.entity.ordenCompra}}&employee=' + $scope.idEmpleado + '&proceso=1" target="_new">{{row.entity.ordenCompra}}</a></div>' },
                { name: 'monto', displayName: 'Monto', width: '10%', cellFilter: 'currency', enableCellEdit: false },
                {
                    name: 'Pagar',
                    field: 'Pagar',
                    displayName: 'Pagar (total)',
                    width: '10%',
                    cellFilter: 'currency',
                    enableCellEdit: ($scope.currentIdOp == 1) ? false : true,
                    editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
                },
                { name: 'cuentaPagadora', width: '10%', displayName: 'Banco Origen', enableCellEdit: false },
                { name: 'cuenta', width: '15%', displayName: '# Cuenta', enableCellEdit: false },
                { name: 'fechaPromesaPago', displayName: 'Fecha Promesa de Pago', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '15%' },
                {
                    name: 'referencia',
                    displayName: 'Referencia',
                    width: '10%',
                    visible: true,
                    enableCellEdit: true
                },
                {
                    name: 'referenciaNueva',
                    displayName: 'Referencia Numerica',
                    width: '10%',
                    visible: true,
                    enableCellEdit: true
                },
                { name: 'tipo', width: '15%', displayName: 'Tipo', enableCellEdit: false },
                { name: 'tipodocto', width: '15%', displayName: 'Tipo Documento', enableCellEdit: false },
                { name: 'cartera', width: '15%', displayName: 'Cartera', enableCellEdit: false },
                { name: 'moneda', width: '10%', displayName: 'Moneda', enableCellEdit: false },
                { name: 'numeroSerie', width: '20%', displayName: 'N Serie', enableCellEdit: false },
                { name: 'facturaProveedor', width: '20%', displayName: 'Factura Proveedor', enableCellEdit: false },
                { name: 'fechaVencimiento', displayName: 'Fecha de Vencimiento', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
                { name: 'fechaRecepcion', displayName: 'Fecha Recepción', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
                { name: 'fechaFactura', displayName: 'Fecha Factura', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', width: '17%', enableCellEdit: false },
                { name: 'saldoPorcentaje', field: 'saldoPorcentaje', displayName: 'Porcentaje %', width: '10%', cellFilter: 'number: 6', enableCellEdit: false },
                { name: 'estatus', displayName: 'Estatus', width: '10%', enableCellEdit: false },
                { name: 'anticipo', displayName: 'Anticipo', width: '10%', enableCellEdit: false },
                { name: 'anticipoAplicado', displayName: 'Anticipo Aplicado', width: '15%', enableCellEdit: false },
                { name: 'documentoPagable', width: '15%', displayName: 'Estatus del Documento', visible: false, enableCellEdit: false },
                { name: 'ordenBloqueada', displayName: 'Bloqueada', width: '20%', enableCellEdit: false },
                { name: 'fechaPago', displayName: 'fechaPago', width: '20%', visible: false, enableCellEdit: false },
                { name: 'estGrid', width: '15%', displayName: 'Estatus Grid', enableCellEdit: false },
                { name: 'seleccionable', displayName: 'seleccionable', width: '20%', enableCellEdit: false, visible: false },
                {
                    name: 'cuentaDestino',
                    displayName: 'Cuenta Destino',
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    width: '20%',
                    editDropdownOptionsFunction: function(rowEntity, colDef) {
                        if (rowEntity.cuentaDestino === 'bar') {
                            return [{ id: 'SIN CUENTA', value: 'SIN CUENTA' }];
                        } else {
                            var index;
                            var bancosArray = rowEntity.cuentaDestinoArr.split(',');
                            var bancoSalida = [];

                            for (index = 0; index < bancosArray.length; ++index) {
                                var obj = {};
                                obj.id = bancosArray[index];
                                obj.value = bancosArray[index];
                                bancoSalida.push(obj);
                            }
                            return bancoSalida;
                        }
                    }
                },
                { name: 'idEstatus', displayName: 'idEstatus', width: '20%', enableCellEdit: false, visible: true },
                { name: 'tipoCartera', displayName: 'tipoCartera', width: '20%', enableCellEdit: false, visible: true },
                { name: 'numagrupar', displayName: 'numagrupar', width: '20%', enableCellEdit: false, visible: false },
                { name: 'bancoPagador', displayName: 'bancoPagador', width: '20%', enableCellEdit: false, visible: false },
                { name: 'autorizado', displayName: 'Cuenta Autorizada', width: '20%', enableCellEdit: false, visible: true, cellTemplate: '<div ng-if="row.entity.autorizado == 1">Autorizado</div><div ng-if="row.entity.autorizado == 0">No autorizado</div>' }
            ],

            rowTemplate: '<div ng-class="{\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
                ',\'bloqueadaSelec\': (row.isSelected && row.entity.ordenBloqueada==\'True\') || (row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20)),' +
                '\'bancocss\': (row.entity.referencia==\'Banco\'),' +
                '\'plantacss\': (row.entity.referencia==\'Planta\'),' +
                '\'selectNormal\': (row.isSelected && row.entity.ordenBloqueada==\'False\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20))' +
                ',\'docIncompletos\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'False\')' +
                ',\'bloqDocIncom\': (!row.isSelected && ((row.entity.idEstatus >= 1 && row.entity.idEstatus <= 5) || row.entity.idEstatus == 20) && row.entity.ordenBloqueada==\'True\')' +
                ',\'ordenBloqueada\':(row.entity.ordenBloqueada==\'True\' && ((row.entity.idEstatus < 1 || row.entity.idEstatus > 5) && row.entity.idEstatus != 20) && !row.isSelected)' +
                '}"> <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader == \'True\'}" ui-grid-cell></div></div>',

            onRegisterApi: function(gridApi1) {
                $scope.gridApi1 = gridApi1;
                //FAL14042016 Marcado de grupos y proveedores
                gridApi1.selection.on.rowSelectionChanged($scope, function(row, rows) {
                    if (row.internalRow == true && row.isSelected == true) {
                        var childRows = row.treeNode.children;
                        for (var j = 0, length = childRows.length; j < length; j++) {
                            $scope.selectAllChildren(gridApi1, childRows[j]);
                        }
                    }
                    if (row.internalRow == true && row.isSelected == false) {
                        var childRows = row.treeNode.children;
                        for (var j = 0, length = childRows.length; j < length; j++) {
                            $scope.unSelectAllChildren(gridApi1, childRows[j]);
                        }
                    }
                    if (row.internalRow == undefined && row.isSelected == true && row.entity.seleccionable == "False") {
                        var childRows = row.treeNode.parentRow.treeNode.children;
                        var numchilds = row.treeNode.parentRow.treeNode.aggregations[0].value;
                        var ctdSeleccionados = 0;
                        for (var j = 0; j < numchilds; j++) {
                            if (childRows[j].row.isSelected == true) {
                                ctdSeleccionados = ctdSeleccionados + 1;
                            }
                            if (ctdSeleccionados == numchilds) {
                                id = "closeMenu"
                                row.treeNode.parentRow.treeNode.row.isSelected = true;
                            }
                        }
                    }
                    if (row.internalRow == undefined && row.isSelected == false) {
                        var childRows = row.treeNode.parentRow.treeNode.children;
                        var numchildRows = row.treeNode.parentRow.treeNode.aggregations[0].value;
                        var ctdSeleccionados = 0;
                        row.referenciaNueva = '';
                        for (var j = 0; j < numchildRows; j++) {
                            if (childRows[j].row.isSelected == true) {
                                ctdSeleccionados = ctdSeleccionados + 1;
                            }
                            if (ctdSeleccionados > 0) {
                                j = numchildRows;
                                row.treeNode.parentRow.treeNode.row.isSelected = false;
                                row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
                            }
                        }
                    }
                    //FAL seleccionado de padres sin afectar las sumas
                    if (row.entity.Pagar == null) {
                        var grdPagarxdocumento = 0
                    } else {
                        grdPagarxdocumento = row.entity.Pagar;
                    }
                    if (row.isSelected) {
                        $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round(grdPagarxdocumento * 100) / 100;
                        if ($scope.grdNoIncluido < 0) { $scope.grdNoIncluido = 0; }
                        //FAL actualizar cuenta pagadoras
                        if ($scope.grdinicia > 0) {
                            if (row.entity.estGrid == 'Pago Reprogramado') {
                                $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                            };

                            if ((isNaN(row.entity.Pagar)) == false) {

                                $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                                row.entity.estGrid = 'Pago'

                            }

                        }
                    } else {
                        $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 + Math.round(grdPagarxdocumento * 100) / 100;
                        //FAL actualizar cuenta pagadoras
                        i = 0;
                        if ($scope.grdinicia > 0) {

                            if ((isNaN(row.entity.Pagar)) == false) {

                                $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                                row.entity.estGrid = 'Pago'

                            }


                            //$scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 - Math.round(row.entity.Pagar * 100) / 100;
                            if (row.entity.estGrid != 'Pago Reprogramado') {
                                row.entity.estGrid = 'Permitido'
                            } else {
                                $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                            }

                        }
                    }


                });
                gridApi1.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                    //FAL 29042016 cambio de seleccion de padres
                    var i = 0;
                    var numcuentas = $scope.grdBancos.length;
                    $scope.grdNoIncluido = 0;
                    if ($scope.grdinicia > 0) {
                        $scope.grdBancos.forEach(function(banco, l) {
                            $scope.grdBancos[l].subtotal = 0;
                            $scope.grdApagar = 0;
                        });
                    }
                    if ($scope.grdinicia > 0) {
                        rows.forEach(function(row, i) {
                            if (row.isSelected) {
                                if (row.entity.seleccionable == 'False') {
                                    row.entity.estGrid = 'Pago';
                                    $scope.grdNoIncluido = 0;
                                    $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round(row.entity.Pagar * 100) / 100;
                                    //$scope.grdApagar = $scope.grdApagar + row.entity.Pagar;
                                    i = numcuentas;
                                    $scope.grdNoIncluido = 0;
                                }
                            } else {
                                if (row.entity.seleccionable == 'False') {
                                    row.entity.estGrid = 'Permitido';
                                    $scope.grdNoIncluido = $scope.grdApagarOriginal;
                                    row.treeNode.parentRow.treeNode.row.isSelected = false;
                                    row.treeNode.parentRow.treeNode.parentRow.treeNode.row.isSelected = false;
                                    $scope.grdApagar = 0;
                                }
                            }
                        });
                    }

                    $scope.calculaTotalOperaciones();
                    recalculaIngresos();

                });
                gridApi1.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                    //FAL trabaja con las variables dependiendo si se edita o cambia la fecha
                    var i = 0;
                    var numcuentas = $scope.grdBancos.length;
                    if (rowEntity.estGrid == 'Pago' || rowEntity.estGrid == 'Pago Reprogramado') {
                        if (rowEntity.fechaPago == "1900-01-01T00:00:00") {
                            old_date = "";
                        } else {
                            old_date = new Date(rowEntity.fechaPago);
                        }
                        if (colDef.name == 'fechaPromesaPago') {
                            dtHoy = Date.now();
                            now_date = new Date($scope.formatDate(dtHoy));
                            new_date = new Date($scope.formatDate(newValue));
                            if (new_date <= now_date) {
                                alertFactory.warning('La fecha promesa de pago no puede ser menor o igual a ' + $scope.formatDate(dtHoy) + ' !!!');
                                rowEntity.fechaPromesaPago = old_date;
                                rowEntity.estGrid = 'Pago';
                            } else {
                                rowEntity.Pagar = rowEntity.saldo;
                                rowEntity.estGrid = 'Pago Reprogramado';
                                $scope.gridApi1.selection.unSelectRow(rowEntity);
                            }
                        }
                        if (colDef.name == 'Pagar') {
                            $scope.cantidadUpdate = newValue - oldValue;
                            if ((newValue > rowEntity.saldo) || (newValue <= 0)) {
                                alertFactory.warning('El pago es inválido !!!');
                                rowEntity.Pagar = oldValue;
                            } else {
                                if (rowEntity.estGrid == 'Pago Reprogramado') {
                                    $scope.grdReprogramado = Math.round($scope.grdReprogramado * 100) / 100 - Math.round(rowEntity.Pagar * 100) / 100;
                                }
                                for (var i = 0; i < numcuentas; i++) {
                                    if (rowEntity.cuentaPagadora == $scope.grdBancos[i].banco) {
                                        $scope.grdBancos[i].subtotal = Math.round($scope.grdBancos[i].subtotal * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                                        i = numcuentas;
                                    }
                                };
                                $scope.grdNoIncluido = Math.round($scope.grdNoIncluido * 100) / 100 - Math.round($scope.cantidadUpdate * 100) / 100;
                                $scope.grdApagar = Math.round($scope.grdApagar * 100) / 100 + Math.round($scope.cantidadUpdate * 100) / 100;
                                rowEntity.estGrid = 'Pago';
                                rowEntity.fechaPromesaPago = old_date;
                            }
                        }
                        //FAL valido la referencia.
                        if (colDef.name == 'referencia') {
                            if (rowEntity.convenioCIE == "")

                            {
                                if (newValue.length > 30) {
                                    alertFactory.warning('La referencia no puede tener más de 30 caracteres');
                                    rowEntity.referencia = oldValue;
                                }
                            } else {
                                if ((newValue.length < 5) || (newValue.length > 30)) {
                                    alertFactory.warning('La referencia CIE no puede tener más de 30 caracteres ni menos de 5');
                                    rowEntity.referencia = oldValue;
                                }
                            }
                        }
                        //27/08/2022 valido la referencia Especial.
                        if (colDef.name == 'referenciaNueva') {
                           
                            if (newValue.length > 7) {
                                alertFactory.warning('La referencia numérica no puede tener más de 7 caracteres');
                                rowEntity.referenciaNueva = oldValue;
                                
                            }
                            const numbers = /^[0-9]+$/;
                            if(!rowEntity.referenciaNueva.match(numbers))
                            {
                                alertFactory.warning('La referencia numérica debe contener solo números');
                                rowEntity.referenciaNueva = ''
                            }
                            let rows = $scope.gridApi1.selection.getSelectedRows();
                            angular.forEach(rows, function(element, key) {
                                if(rowEntity.idProveedor == element.idProveedor && rowEntity.agrupar == 0 && rowEntity.referenciaNueva != element.referenciaNueva){
                                    alertFactory.warning('La referencia numérica debe ser igual cuando es agrupado');
                                    rowEntity.referenciaNueva = element.referenciaNueva
                                }
                            });
                        }

                    } else {
                        alertFactory.warning('Solo se pueden modificar datos de los documentos seleccionados');
                        if (colDef.name == 'Pagar') {
                            rowEntity.Pagar = oldValue;
                        }
                        if (colDef.name == 'fechaPromesaPago') {
                            rowEntity.fechaPromesaPago = oldValue;
                        }
                        if (colDef.name == 'referenciaNueva') {
                            rowEntity.referenciaNueva = '';
                        }
                    }
                });
            }
        }
    };
});