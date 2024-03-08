import Swal from 'sweetalert2';
import { createActions, handleActions } from 'redux-actions';
import { goBack } from 'react-router-redux';
import { change, initialize as initializeForm } from 'redux-form';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import { api } from '../../../api/api';
import { RazaGallina } from '../../../common/utility/constants';

const url = 'gallineros';

const LOADER_ESTADOGALLINERO = 'LOADER_ESTADOGALLINERO';
const LOADER_MODAL_ESTADOGALLINERO = 'LOADER_MODAL_ESATDOGALLINERO';
const SET_DATA_ESTADOGALLINERO = 'SET_DATA_ESTADOGALLINERO';
const SET_DATAREINTEGRO_ESTADOGALLINERO = 'SET_DATAREINTEGRO_ESTADOGALLINERO';
const SET_PAGE_ESTADOGALLINERO = 'SET_PAGE_ESTADOGALLINERO';
const SET_UPDATE_DATA_ESTADOGALLINERO = 'SET_UPDATE_DATA_ESTADOGALLINERO';
const SET_BUSCADOR_ESTADOGALLINERO = 'SET_BUSCADOR_ESTADOGALLINERO';
const SET_PROYECTO_ESTADOGALLINERO = 'SET_PROYECTO_ESTADOGALLINERO';
const SET_FILTRO_ESTADOGALLINERO = 'SET_FILTRO_ESTADOGALLINERO';
const SET_EMPRESAS_ESTADOGALLINERO = 'SET_EMPRESAS_ESTADOGALLINERO';
const SET_TOGGLEMODAL_ESTADOGALLINERO = 'SET_TOGGLEMODAL_ESTADOGALLINERO';
const SET_IDGALLINERO_ESTADOGALLINERO = 'SET_IDGALLINERO_ESTADOGALLINERO';

// ------------------------------------
// Actions
// ------------------------------------
const setIdGallinero = id => (dispatch, getStore) => {
    dispatch({ type: SET_IDGALLINERO_ESTADOGALLINERO, idGallinero: id });
};
const listar = (page = 1) => (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({ type: LOADER_ESTADOGALLINERO, cargando: true });
    // parametros de búsqueda
    const store = getStore();
    const idGallinero = store.estadogallinero.idGallinero;

    // movimientos/estadocuenta/${proyecto}
    api.get(`movGranja/getHistoriaMediciones/${idGallinero}`, { page }).catch((error) => {
        // dispatch(cargandoPrestamos(false));
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        // dispatch(cargandoPrestamos(false));
        if (data) {
            dispatch({ type: SET_DATA_ESTADOGALLINERO, dataPeso: data });
            // dispatch(setDataPrestamos(data));
            dispatch({ type: SET_PAGE_ESTADOGALLINERO, page });
            // dispatch(setPagePrestamos(page));
        }
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
    });
};
const listarReajuste = (page = 1) => (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({ type: LOADER_ESTADOGALLINERO, cargando: true });

    // parametros de búsqueda
    const store = getStore();
    const idGallinero = store.estadogallinero.idGallinero;


    // movimientos/estadocuenta/${proyecto}
    api.get(`movGranja/getHistoriaAjustes/${idGallinero}`, { page }).catch((error) => {
        // dispatch(cargandoPrestamos(false));
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        // dispatch(cargandoPrestamos(false));
        if (data) {
            dispatch({ type: SET_DATAREINTEGRO_ESTADOGALLINERO, dataReajuste: data });
            // dispatch(setDataPrestamos(data));
            dispatch({ type: SET_PAGE_ESTADOGALLINERO, page });
            // dispatch(setPagePrestamos(page));
        }
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
    });
};
const detail = id => (dispatch, getState) => {
    dispatch({ type: LOADER_ESTADOGALLINERO, cargando: true });
    api.get(`proyectos/getInfoGallinero/${id}`).catch((error) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        if (error.statusCode === 404) {
        }
    }).then((data) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        if (data) {
            dispatch({ type: SET_UPDATE_DATA_ESTADOGALLINERO, updateData: data });
            if (data.ultimoRegistro) {
                dispatch(change('movimiento', 'fecha_inicial', data.ultimoRegistro.fecha_inicial));
                dispatch(change('movimiento', 'edad_inicial', data.ultimoRegistro.edad_inicial));
                try {
                    const raza = _.find(RazaGallina, { label: data.ultimoRegistro.raza }).value;
                    dispatch(change('movimiento', 'raza', raza));
                } catch (e) { }
            }
        }
    });
};

const resetData = () => (dispatch) => {
    dispatch({ type: SET_UPDATE_DATA_ESTADOGALLINERO, updateData: {} });
    dispatch(initializeForm('movimiento', null));
};

const getSemana = id => (dispatch, getState) => {
    dispatch({ type: LOADER_ESTADOGALLINERO, cargando: true });
    api.get(`proyectos/getGallineroForm/${id}`).catch((error) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        if (error.statusCode === 404) {
        }
    }).then((data) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        if (data) {
            try {
                data.raza = _.find(RazaGallina, { label: data.raza }).value;
            } catch (e) {
                data.raza = null;
            }
            delete data.semana;
            dispatch(initializeForm('movimiento', data));
        }
    });
};

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.bodega.values;
    dispatch({ type: LOADER_ESTADOGALLINERO, cargando: true });
    api.post(`${url}`, formData).then((data) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        Swal('Éxito', 'Se ha creado la bodega.', 'success')
            .then(() => {
                dispatch(push('/bodegas'));
            });
    }).catch((error) => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({ type: LOADER_ESTADOGALLINERO, cargando: false });
    });
};
const hacerPeticion = (tipo = 1) => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.movimiento.values);
    if (formData.cantidad_agua || formData.cantidad_alimento) {
        dispatch(alimentoAgua());
    } else {
        dispatch(movimientoBodega(tipo));
    }
};
const alimentoAgua = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.movimiento.values);
    const gallinero = getStore().estadogallinero.idGallinero;
    dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: true });
    api.put(`proyectos/asignarTecnico/${gallinero}`, formData)
        .then((data) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            if (data) {
                swal(
                    'Éxito',
                    'Datos editados correctamente.',
                    'success'
                ).then(() => {
                    dispatch({ type: SET_TOGGLEMODAL_ESTADOGALLINERO, toggleModal: false });
                    dispatch(detail(gallinero));
                });
            }
        })
        .catch((error) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            swal(
                'Error',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
                'error'
            );
            if (error.statusCode === 404) {
            }
        });
};
const costosGranja = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.costogranja.values);
    const gallinero = getStore().estadogallinero.idGallinero;
    try {
        formData.fecha_inicio_costo = formData.fecha_inicio_costo.format('YYYY-MM-D');
    } catch (error) {
        formData.fecha_inicio_costo = formData.fecha_inicio_costo;
    }
    dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: true });
    api.put(`proyectos/asignarrecuperacion/${gallinero}`, formData)
        .then((data) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            if (data) {
                swal(
                    'Éxito',
                    'Datos editados correctamente.',
                    'success'
                ).then(() => {
                    dispatch({ type: SET_TOGGLEMODAL_ESTADOGALLINERO, toggleModal: false });
                    dispatch(detail(gallinero));
                });
            }
        })
        .catch((error) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            swal(
                'Error',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
                'error'
            );
            if (error.statusCode === 404) {
            }
        });
};
const movimientoBodega = (tipo = 1, regresar) => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.movimiento.values);
    const gallinero = getStore().estadogallinero.idGallinero;
    let ruta = 'movGranja/registrar_peso';
    if (tipo === 1) {
        let promedio = 0;
        formData.pesos.map((x) => {
            promedio += Number(x.peso);
        });
        promedio /= formData.pesos.length;
        formData.promedio = promedio;
    }
    if (tipo === 2) {
        ruta = 'movGranja/reajustar_gallinas';
    }
    try {
        formData.fecha = formData.fecha.format('YYYY-MM-D');
    } catch (error) {
        formData.fecha = formData.fecha;
    }

    try {
        formData.fecha_inicial = formData.fecha_inicial.format('YYYY-MM-D');
    } catch (error) {
        formData.fecha_inicial = formData.fecha_inicial;
    }
    formData.gallinero = gallinero;
    dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: true });
    api.post(`${ruta}`, formData)
        .then((data) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            if (data) {
                if (regresar) { dispatch(push(regresar)); }
                swal(
                    'Éxito',
                    'Datos editados correctamente.',
                    'success'
                ).then(() => {
                    dispatch({ type: SET_TOGGLEMODAL_ESTADOGALLINERO, toggleModal: false });
                    if (tipo === 1) {
                        dispatch(listar());
                        dispatch(detail(gallinero));
                    } else if (tipo === 2) {
                        dispatch(listarReajuste());
                        dispatch(detail(gallinero));
                    }
                });
            }
        })
        .catch((error) => {
            dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
            swal(
                'Error',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
                'error'
            );
            if (error.statusCode === 404) {
            }
        });
};

const updateSemana = regresar => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.movimiento.values);
    const gallinero = getStore().estadogallinero.idGallinero;
    const ruta = 'movGranja/semanas';

    let promedio = 0;
    formData.pesos.forEach((x) => {
        promedio += Number(x.peso);
    });
    promedio /= formData.pesos.length;
    formData.promedio = promedio;

    try {
        formData.fecha = formData.fecha.format('YYYY-MM-D');
    } catch (error) {
        formData.fecha = formData.fecha;
    }

    try {
        formData.fecha_inicial = formData.fecha_inicial.format('YYYY-MM-D');
    } catch (error) {
        formData.fecha_inicial = formData.fecha_inicial;
    }
    formData.gallinero = gallinero;
    dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: true });

    api.put(`${ruta}/${formData.id}`, formData).then((data) => {
        dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
        dispatch(push(regresar));
        if (data) {
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
            });
        }
    }).catch((error) => {
        dispatch({ type: LOADER_MODAL_ESTADOGALLINERO, cargandoModal: false });
        swal(
            'Error', (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        );
    });
};

const setToggleModal = estado => (dispatch, getStore) => {
    dispatch({ type: SET_TOGGLEMODAL_ESTADOGALLINERO, toggleModal: estado });
};
const search = search => (dispatch, getStore) => {
    dispatch({ type: SET_BUSCADOR_ESTADOGALLINERO, buscador: search });
    dispatch(listar(1));
};
const filtro = filtro => (dispatch, getStore) => {
    if (filtro == 0) {
        filtro = null;
    }
    dispatch({ type: SET_FILTRO_ESTADOGALLINERO, filtro_bodega: filtro });
    dispatch(listar(1));
};

export const actions = {
    setIdGallinero,
    listar,
    listarReajuste,
    detail,
    create,
    movimientoBodega,
    search,
    filtro,
    setToggleModal,
    hacerPeticion,
    costosGranja,
    getSemana,
    updateSemana,
    resetData,
};

export const reducer = {
    [LOADER_ESTADOGALLINERO]: (state, { cargando }) => {
        return { ...state, cargando };
    },
    [SET_DATA_ESTADOGALLINERO]: (state, { dataPeso }) => {
        return { ...state, dataPeso };
    },
    [SET_DATAREINTEGRO_ESTADOGALLINERO]: (state, { dataReajuste }) => {
        return { ...state, dataReajuste };
    },
    [SET_PAGE_ESTADOGALLINERO]: (state, { page }) => {
        return { ...state, page };
    },
    [SET_UPDATE_DATA_ESTADOGALLINERO]: (state, { updateData }) => {
        return { ...state, updateData };
    },
    [SET_BUSCADOR_ESTADOGALLINERO]: (state, { buscador }) => {
        return { ...state, buscador };
    },
    [SET_FILTRO_ESTADOGALLINERO]: (state, { filtro_bodega }) => {
        return { ...state, filtro_bodega };
    },
    [SET_EMPRESAS_ESTADOGALLINERO]: (state, { empresasSelect }) => {
        return { ...state, empresasSelect };
    },
    [SET_TOGGLEMODAL_ESTADOGALLINERO]: (state, { toggleModal }) => {
        return { ...state, toggleModal };
    },
    [SET_IDGALLINERO_ESTADOGALLINERO]: (state, { idGallinero }) => {
        return { ...state, idGallinero };
    },
    [LOADER_MODAL_ESTADOGALLINERO]: (state, { cargandoModal }) => {
        return { ...state, cargandoModal };
    },
};

export const initialState = {
    idGallinero: 0,
    cargando: false,
    cargandoModal: false,
    page: 1,
    toggleModal: false,
    dataPeso: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    dataReajuste: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    filtro_bodega: null,
    updateData: {
        nombre: '',
        empresa: '',
    },
    empresasSelect: [],
};

export default handleActions(reducer, initialState);
