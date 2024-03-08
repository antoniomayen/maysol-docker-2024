import logoM from 'imagenes/img/login/logomaysol.png';
import logoP from 'imagenes/img/login/logodelpinal.png';
import logoDvM from 'imagenes/img/backmaysol.png';
import logoDvP from 'imagenes/img/backdelpinal.png';
import backgroundM from 'imagenes/img/login/backmaysol.png';
import backgroundP from 'imagenes/img/login/backdelpinal.png';
import logoNvM from 'imagenes/img/logoBarmaysol.png';
import logoNvP from 'imagenes/img/logoBardelpinal.png';

export const ROLES = { ADMINISTRADOR: 100, BACKOFFICE: 50, COLABORADOR: 80 };

// Estos valores estan ligados al Backend
// Si se modifican, se tienen que cambiar tambien el el Backend
// La propiedad value, esta aligada con la posisision en la que se
// encuentra cada valor para cada Raza
// El nombre no lo toma del label, sino del array que esta en el backend
export const RazaGallina = [
    { value: '0', label: 'Brown Nick' },
    { value: '1', label: 'Lohmann Brown' },
    { value: '2', label: 'White Nick' },
];

export const nivelesOptions = [
    { value: 100, label: 'SuperAdministrador' },
    { value: 80, label: 'Colaborador' },
];

export const Monedas = [
    { value: 'USD', label: 'USD', simbolo: '$' },
    { value: 'GTQ', label: 'GTQ', simbolo: 'Q' },
];

export const opcionesBanco = [
    { value: '20', label: 'Tarjeta', documento: 'No comprobante' },
    { value: '30', label: 'Transacción', documento: 'No transacción' },
    { value: '40', label: 'Cheque', documento: 'No. cheque' },
    { value: '60', label: 'Guate ACH', documento: 'No. documento' },
];
export const gastoCaja = [
    { value: '10', label: 'Efectivo', documento: '' },
    { value: '50', label: 'Depósito', documento: 'No. Boleta' },
];
export const opcionesCaja = [
    { value: '20', label: 'Tarjeta', documento: 'No comprobante' },
    { value: '40', label: 'Cheque', documento: 'No cheque' },
    { value: '30', label: 'Transacción', documento: 'No transacción' },
];
export const opcionesVenta = [
    { value: '10', label: 'Efectivo', documento: '' },
    { value: '20', label: 'Tarjeta', documento: 'No comprobante' },
    { value: '30', label: 'Transacción', documento: 'No transacción' },
    { value: '40', label: 'Cheque', documento: 'No cheque' },
    { value: '50', label: 'Depósito', documento: 'No. Boleta' },
];
export const Meses = [
    { id: 1, value: 1, label: 'Enero' },
    { id: 2, value: 2, label: 'Febrero' },
    { id: 3, value: 3, label: 'Marzo' },
    { id: 4, value: 4, label: 'Abril' },
    { id: 5, value: 5, label: 'Mayo' },
    { id: 6, value: 6, label: 'Junio' },
    { id: 7, value: 7, label: 'Julio' },
    { id: 8, value: 8, label: 'Agosto' },
    { id: 9, value: 9, label: 'Septiembre' },
    { id: 10, value: 10, label: 'Octubre' },
    { id: 11, value: 11, label: 'Noviembre' },
    { id: 12, value: 12, label: 'Diciembre' },
];
export const tipoMovimientoBodega = [
    { id: 0, nombre: 'Todos' },
    { id: 10, nombre: 'Ingreso' },
    { id: 30, nombre: 'Despacho' },
    { id: 40, nombre: 'Reajuste' },
    { id: 50, nombre: 'Baja' },

];
export const CF = [
    { id: 1, value: 1, espaniol: 'Ventas en efectivo', japones: '現金売上' },
    { id: 2, value: 2, espaniol: 'Cuentas por cobrar', japones: '売掛金入金 ' },
    { id: 3, value: 3, espaniol: 'Pago anticipado', japones: '前受金' },
    { id: 4, value: 4, espaniol: 'Depósito de garantía', japones: '預り保証金' },
    { id: 5, value: 5, espaniol: 'Otros / cobro de prestamos', japones: 'その他現金/売掛金入金' },
    { id: 6, value: 6, espaniol: 'Compra en efectivo', japones: '現金仕入' },


    { id: 7, value: 7, espaniol: 'Cuentas por pagar', japones: '買掛金支払' },
    { id: 8, value: 8, espaniol: 'Deudas pendientes', japones: '未払金支払' },
    { id: 9, value: 9, espaniol: 'Gastos pagados por adelantado', japones: '前払費用' },
    { id: 10, value: 10, espaniol: 'Costo de venta y administración', japones: '販売管理費' },
    { id: 11, value: 11, espaniol: 'Otros gastos/ pago de prestamos', japones: 'その他仕入/販管費支払' },


    { id: 12, value: 12, espaniol: 'Tiendas · Edificios', japones: '店舗・建物' },
    { id: 13, value: 13, espaniol: 'Maquinaria · Accesorios · Vehículo', japones: '機械・備品・車両' },
    { id: 14, value: 14, espaniol: 'Construcción en progreso', japones: '建設仮勘定' },
    { id: 15, value: 15, espaniol: 'Construcción de software en progreso', japones: 'ソフトウェア建設仮勘定' },
    { id: 16, value: 16, espaniol: 'Renta / depósito de renta', japones: '敷金・保証金' },


    { id: 17, value: 17, espaniol: 'Capital', japones: '資本金' },
    { id: 18, value: 18, espaniol: 'Ahorros', japones: '積立他' },
    { id: 19, value: 19, espaniol: 'Préstamos', japones: '借入金調達' },
    { id: 20, value: 20, espaniol: 'Pago de préstamos (incluidos los intereses)', japones: '借入金返済（利息込）' },
    // faltantes cf
    { id: 54, value: 54, espaniol: 'Ajuste de depósito intergrupal', japones: 'ｸﾞﾙｰﾌﾟ間預金調整' },
];

export const PL = [
    // 0--6
    { id: 21, value: 21, espaniol: 'Publicidad por internet', japones: '純粋' },
    { id: 22, value: 22, espaniol: 'PPC', japones: 'PPC' },
    { id: 23, value: 23, espaniol: 'Sistema de costos de diseño', japones: 'デザイン費系' },
    { id: 24, value: 24, espaniol: 'Gastos de publicidad', japones: '販促費' },
    { id: 25, value: 25, espaniol: 'Tarifa de uso del sistema', japones: 'システム利用料' },
    { id: 26, value: 26, espaniol: 'Otros (distribución de muestras, implementación de eventos, etc.)', japones: 'その他（サンプル配布、イベント実施etc）' },
    { id: 27, value: 27, espaniol: 'Coste de consignación del servicio de respaldo (creativo, relaciones públicas, etc.)', japones: 'バックアップ業務委託費(ｸﾘｴｲﾃｨﾌﾞ,PR,etc)' },

    // 7-8
    { id: 28, value: 28, espaniol: 'Comisión de ventas', japones: '販売手数料' },
    { id: 29, value: 29, espaniol: 'Tasa de liquidación', japones: '決済手数料' },

    // 9
    { id: 30, value: 30, espaniol: 'Transporte domestico', japones: '国内運搬' },

    /** ***************************** */
    // 10
    { id: 31, value: 31, espaniol: 'gastos mensuales (aquellos directamente relacionados con las operaciones comerciales)', japones: '消耗品/月次経費（事業運営に直接関わるもの）' },

    // 11-13
    { id: 32, value: 32, espaniol: 'Transporte de importación / exportación en el extranjero (distinto del costo)', japones: '海外輸出入運搬（原価以外）' },
    { id: 33, value: 33, espaniol: 'Telefono, internet', japones: '電話、インターネット' },
    { id: 34, value: 34, espaniol: 'Otros gastos de comunicación (sellos etc.)', japones: 'その他通信費（切手等）' },

    // 14-18
    { id: 35, value: 35, espaniol: 'Sueldo pago', japones: '支払い給与' },
    { id: 36, value: 36, espaniol: 'Trabajo a tiempo parcial a corto plazo', japones: '短期アルバイト' },
    { id: 37, value: 37, espaniol: 'Gastos de viaje (ajuste de gastos)', japones: '旅費交通費（経費精算）' },
    { id: 38, value: 38, espaniol: 'Gastos de transporte diario', japones: '通勤交通費' },
    { id: 39, value: 39, espaniol: 'Gastos legales de bienestar social', japones: '法定福利費' },

    // 19
    { id: 40, value: 40, espaniol: 'Costo de reclutamiento', japones: '採用活動費' },

    // 20
    { id: 41, value: 41, espaniol: 'Costo de desarrollo del producto / servicio', japones: '商品/サービス開発費' },

    // 21-23
    { id: 42, value: 42, espaniol: 'Comisión bancaria', japones: '銀行手数料' },
    { id: 43, value: 43, espaniol: 'Comisión de corretaje', japones: '仲介手数料' },
    { id: 44, value: 44, espaniol: 'Otra cuota de pago', japones: 'その他支払手数料' },

    // 24-27
    { id: 45, value: 45, espaniol: 'Alquiler de alquiler, servicios públicos de calefacción, tarifa de comunicación', japones: '地代家賃・水道光熱費・通信費' },
    { id: 46, value: 46, espaniol: 'Gastos de suministros de oficina', japones: '事務用消耗品費' },
    { id: 47, value: 47, espaniol: 'Bienestar social', japones: '福利厚生' },
    { id: 48, value: 48, espaniol: 'Costo de mantenimiento', japones: '修繕費' },

    // 28-30
    { id: 51, value: 51, espaniol: 'Retención de impuestos', japones: '源泉税' },
    { id: 52, value: 52, espaniol: 'Impuesto', japones: '租税公課' },
    { id: 53, value: 53, espaniol: 'Otros', japones: 'その他' },

    // faltantes
    // 31 - 33
    { id: 159, value: 159, espaniol: 'Depreciación', japones: '減価償却' },
    { id: 160, value: 160, espaniol: 'Depreciación Sistemas', japones: '減価償却（システム系-30万円以上）' },
    { id: 161, value: 161, espaniol: 'Establecimiento de inversión', japones: '設立投資' },


];

export const options_recuperacion = [
    { value: '159', label: '減価償却 - Depreciación' },
    { value: '160', label: '減価償却（システム系-30万円以上) - Depreciación de sistemas' },
    { value: '161', label: '設立投資 - Establecimiento de inversión' },
];

export const dominios = [
    {
        dominio: 'app.borderless-guatemala.com',
        logo: logoM,
        fondo: backgroundM,
        logoNv: logoNvM,
        logoDv: logoDvM,
        color: 'linear-gradient(to right, #F69314, #EB5826)',
        colorNv: 'linear-gradient(to right, #45315D, #F69314)',
        colorH: '',
        nombre: 'MAYSOL',
    },
    {
        dominio: 'elpinal.borderless-guatemala.com',
        logo: logoP,
        fondo: backgroundP,
        logoNv: logoNvP,
        logoDv: logoDvP,
        color: 'linear-gradient(to right, #27496D, #02DAFF)',
        colorNv: 'linear-gradient(to right, #45315D, #1489A9)',
        colorH: '',
        nombre: 'EL PINAL',
    },
];
