#Ventas de cashflow

ventas_efectivo = 1
Cuentas_cobrar = 2
Pago_anticipado = 3
Deposito_garantía = 4
Otro_efectivo = 5
Compra_efectivo = 6
Cuentas_pagar = 7
Pago_acumulado = 8
Gastos_pagados_adelantado = 9
Venta_dministracion = 10
Otras_compras = 11

#Inversión CF
Tiendas_Edificios = 12
Maquinaria_Accesorios_Vehiculo = 13
Construccion_progreso = 14
Construccion_software = 15
Deposito_seguridad = 16

#Finanzas CF
Capital = 17
Otros_financiados = 18
Adquisicion_prestamos = 19
reembolso_deuda = 20
intergrupal = 54

CF = {
    1: {"es": "Ventas en efectivo", "jp": "現金売上"},
    2: {"es": "Cuentas por cobrar", "jp": "売掛金入金 "},
    3: {"es": "Pago anticipado", "jp": "前受金"},
    4: {"es": "Depósito de garantía", "jp": "預り保証金"},
    5: {"es": "Otros / cobro de prestamos", "jp": "その他現金/売掛金入金"},
    6: {"es": "Compra en efectivo", "jp": "現金仕入"},
    7: {"es": "Cuentas por pagar", "jp": "買掛金支払"},
    8: {"es": "Deudas pendientes", "jp": "未払金支払"},
    9: {"es": "Gastos pagados por adelantado", "jp": "前払費用"},
    10: {"es": "Costo de venta y administración", "jp": "販売管理費"},
    11: {"es": "Otros gastos/ pago de prestamos", "jp": "その他仕入/販管費支払"},
    12: {"es": "Tiendas · Edificios", "jp": "店舗・建物"},
    13: {"es": "Maquinaria · Accesorios · Vehículo", "jp": "機械・備品・車両"},
    14: {"es": "Construcción en progreso", "jp": "建設仮勘定"},
    15: {"es": "Construcción de software en progreso", "jp": "ソフトウェア建設仮勘定"},
    16: {"es": "Renta / depósito de renta", "jp": "敷金・保証金"},
    17: {"es": "Capital", "jp": "資本金"},
    18: {"es": "Ahorros", "jp": "積立他"},
    19: {"es": "Préstamos", "jp": "借入金調達"},
    20: {"es": "Pago de préstamos (incluidos los intereses)", "jp": "借入金返済（利息込）"},
    54: {"es": "Ajuste de depósito intergrupal", "jp":"ｸﾞﾙｰﾌﾟ間預金調整"}
}

PL = {
    21: {"es": "Publicidad por internet", "jp": "純粋"},
    22: {"es": "PPC", "jp": "PPC"},
    23: {"es": "Sistema de costos de diseño", "jp": "デザイン費系"},
    24: {"es": "Gastos de publicidad", "jp": "販促費"},
    25: {"es": "Tarifa de uso del sistema", "jp": "システム利用料"},
    26: {"es": "Otros (distribución de muestras, implementación de eventos, etc.)", "jp": "その他（サンプル配布、イベント実施etc）"},
    27: {"es": "Coste de consignación del servicio de respaldo (creativo, relaciones públicas, etc.)", "jp": "バックアップ業務委託費(ｸﾘｴｲﾃｨﾌﾞ,PR,etc)"},
    28: {"es": "Comisión de ventas", "jp": "販売手数料"},
    29: {"es": "Tasa de liquidación", "jp": "決済手数料"},
    30: {"es": "Transporte domestico", "jp": "国内運搬"},
    31: {"es": "gastos mensuales (aquellos directamente relacionados con las operaciones comerciales)", "jp": "消耗品/月次経費（事業運営に直接関わるもの）"},
    32: {"es": "Transporte de importación / exportación en el extranjero (distinto del costo)", "jp": "海外輸出入運搬（原価以外）"},
    33: {"es": "Telefono, internet", "jp": "電話、インターネット"},
    34: {"es": "Otros gastos de comunicación (sellos etc.)", "jp": "その他通信費（切手等）"},
    35: {"es": "Sueldo pago", "jp": "支払い給与"},
    36: {"es": "Trabajo a tiempo parcial a corto plazo", "jp": "短期アルバイト"},
    37: {"es": "Gastos de viaje (ajuste de gastos)", "jp": "旅費交通費（経費精算）"},
    38: {"es": "Gastos de transporte diario", "jp": "通勤交通費"},
    39: {"es": "Gastos legales de bienestar social", "jp": "法定福利費"},
    40: {"es": "Costo de reclutamiento", "jp": "採用活動費"},
    41: {"es": "Costo de desarrollo del producto / servicio", "jp": "商品/サービス開発費"},
    42: {"es": "Comisión bancaria", "jp": "銀行手数料"},
    43: {"es": "Comisión de corretaje", "jp": "仲介手数料"},
    44: {"es": "Otra cuota de pago", "jp": "その他支払手数料"},
    45: {"es": "Alquiler de alquiler, servicios públicos de calefacción, tarifa de comunicación", "jp": "地代家賃・水道光熱費・通信費"},
    46: {"es": "Gastos de suministros de oficina", "jp": "事務用消耗品費"},
    47: {"es": "Bienestar social", "jp": "福利厚生"},
    48: {"es": "Costo de mantenimiento", "jp": "修繕費"},
    51: {"es": "Retención de impuestos", "jp": "源泉税"},
    52: {"es": "Impuesto", "jp": "租税公課"},
    53: {"es": "Otros", "jp": "その他"},
    159: {"es": "Depreciación", "jp": "減価償却"},
    160: {"es": "Depreciación sistemas", "jp": "減価償却（システム系-30万円以上）"},
    161: {"es": "Establecimiento de inversión", "jp": "設立投資"},
}
TIPOS_CF = (
    (ventas_efectivo, "Ventas en efectivo"),
    (Cuentas_cobrar, "Cuentas por cobrar"),
    (Pago_anticipado, "Pago anticipado"),
    (Deposito_garantía, "Depósito de garantía"),
    (Otro_efectivo, "Otro efectivo / cuentas por cobrar"),
    (Compra_efectivo, "Compra en efectivo"),
    (Cuentas_pagar, "Cuentas por pagar por pagar"),
    (Pago_acumulado, "Pago acumulado"),
    (Gastos_pagados_adelantado, "Gastos pagados por adelantado"),
    (Venta_dministracion, "Venta, administracion"),
    (Otras_compras, "Otras compras / ventas y pago de gastos administrativos."),
    (Tiendas_Edificios, "Tiendas · Edificios"),
    (Maquinaria_Accesorios_Vehiculo, "Maquinaria · Accesorios · Vehículo"),
    (Construccion_progreso, "Construcción en progreso"),
    (Construccion_software, "Construcción de software en progreso"),
    (Deposito_seguridad, "Depósito de seguridad / depósito de seguridad"),
    (Capital, "Capital"),
    (Otros_financiados, "Otros financiados"),
    (Adquisicion_prestamos, "Adquisición de préstamos"),
    (reembolso_deuda, "Reembolso de la deuda (incluidos los intereses)"),
    (intergrupal, "Ajuste de depósito intergrupal"),
)
ARR_CF = [
    ventas_efectivo,
    Cuentas_cobrar,
    Pago_anticipado,
    Deposito_garantía,
    Otro_efectivo,
    Compra_efectivo,
    Cuentas_pagar,
    Pago_acumulado,
    Gastos_pagados_adelantado,
    Venta_dministracion,
    Otras_compras,
    Tiendas_Edificios,
    Maquinaria_Accesorios_Vehiculo,
    Construccion_progreso,
    Construccion_software,
    Deposito_seguridad,
    Capital,
    Otros_financiados,
    Adquisicion_prestamos,
    reembolso_deuda,
    intergrupal
]
#Parte para PL
#Costos variables
#Costos de publicidad
Puro = 21
PPC = 22
costos_disenio = 23
Gastos_promocionales = 24
uso_sistema = 25
Otros_publicidada = 26
Coste_consignacion = 27

# Comision de ventas
comision_ventas = 28
tasa_liquidacion = 29


#Costos de transporte
transporte_domestico = 30


#Costos fijos

#Costos consumibles /equipo adicional / gastos mensuales
Consumibles = 31


#Costos de comunicación
Transporte_importacion_exportacion = 32
Telefono_internet = 33
Otros_gastos_comunicacion = 34


#Costos de personal
Sueldo_pago = 35
Trabajo_parcial = 36
Gastos_viaje = 37
Gastos_transporte = 38
Gastos_legales = 39

#Costos de reclutamiento
Costo_reclutamiento = 40

#cistis de desarrollo del producto
Costo_producto = 41

#cuota de banco
Comision_bancaria = 42
Comision_corretaje = 43
Otra_cuota_pago = 44



#Otros gastos

Alquiler = 45
suministros_oficina = 46
Bienestar_social = 47
Costo_reparacion = 48
Retencion_impuestos = 51
Impuesto = 52
Otros_gastos = 53
# comision_ventas = 55
# tasa_liquidacion = 56

# Categoria de recuperación (Linea 159 y 160)
Depresiacion = 159
Depresiacion_sistemas = 160
Establecimiento_inversion = 161

TIPOS_PL = (
    (Puro, "Puro"),
    (PPC, "PPC"),
    (costos_disenio, "Sistema de costos de diseño"),
    (Gastos_promocionales, "Gastos promocionales"),
    (uso_sistema, "Tarifa de uso del sistema"),
    (Otros_publicidada, "Otros (distribución de muestras, implementación de eventos, etc.)"),
    (Coste_consignacion, "Coste de consignación del servicio de respaldo (creativo, relaciones públicas, etc.)"),
    (comision_ventas, "Comisión de ventas"),
    (tasa_liquidacion, "Tasa de liquidación"),
    (transporte_domestico, "Transporte domestico"),
    (Consumibles, "Consumibles / gastos mensuales (aquellos directamente relacionados con las operaciones comerciales)"),
    (Transporte_importacion_exportacion, "Transporte de importación / exportación en el extranjero (distinto del costo)"),
    (Telefono_internet, "Telefono, internet"),
    (Otros_gastos_comunicacion, "Otros gastos de comunicación (sellos etc.)"),
    (Sueldo_pago, "Sueldo pago"),
    (Trabajo_parcial, "Trabajo a tiempo parcial a corto plazo"),
    (Gastos_viaje, "Gastos de viaje (ajuste de gastos)"),
    (Gastos_transporte, "Gastos de transporte de cercanías"),
    (Gastos_legales, "Gastos legales de bienestar"),
    (Costo_reclutamiento, "Costo de reclutamiento"),
    (Costo_producto, "Costo de desarrollo del producto / servicio"),
    (Comision_bancaria, "Comisión bancaria"),
    (Comision_corretaje, "Comisión de corretaje"),
    (Otra_cuota_pago, "Otra cuota de pago"),
    (Alquiler, "Alquiler de alquiler, servicios públicos de calefacción, tarifa de comunicación"),
    (suministros_oficina, "Gastos de suministros de oficina"),
    (Bienestar_social, "Bienestar social"),
    (Costo_reparacion, "Costo de reparacion"),
    (Retencion_impuestos, "Retención de impuestos"),
    (Impuesto, "Impuesto"),
    (Otros_gastos, "Otros"),
    (Depresiacion, "Depreciación"),
    (Depresiacion_sistemas, "Depreciación sistemas"),
    (Establecimiento_inversion, "Establecimiento de inversión")
)

ARR_PL = [
    Puro,
    PPC,
    costos_disenio,
    Gastos_promocionales,
    uso_sistema,
    Otros_publicidada,
    Coste_consignacion,
    comision_ventas,
    tasa_liquidacion,
    transporte_domestico,
    Consumibles,
    Transporte_importacion_exportacion,
    Telefono_internet,
    Otros_gastos_comunicacion,
    Sueldo_pago,
    Trabajo_parcial,
    Gastos_viaje,
    Gastos_transporte,
    Gastos_legales,
    Costo_reclutamiento,
    Costo_producto,
    Comision_bancaria,
    Comision_corretaje,
    Otra_cuota_pago,
    Alquiler,
    suministros_oficina,
    Bienestar_social,
    Costo_reparacion,
    Retencion_impuestos,
    Impuesto,
    Otros_gastos,
    Depresiacion,
    Depresiacion_sistemas,
    Establecimiento_inversion
]

ARR_RECUPERACION = {
    Depresiacion,
    Depresiacion_sistemas,
    Establecimiento_inversion
}

