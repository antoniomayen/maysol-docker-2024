import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';


const url = 'productos';

const LOADER_PRODUCTO = 'LOADER_PRODUCTO';
const SET_DATA_PRODUCTO = 'SET_DATA_PRODUCTO';
const SET_PAGE_PRODUCTO = 'SET_PAGE_PRODUCTO';
const SET_UPDATE_DATA_PRODUCTO ='SET_UPDATE_DATA_PRODUCTO';
const SET_BUSCADOR_PRODUCTO = 'SET_BUSCADOR_PRODUCTO';
const SET_PROYECTO_PRODUCTO = 'SET_PROYECTO_PRODUCTO';
const SET_FILTRO_PRODUCTO = 'SET_FILTRO_PRODUCTO';
const SET_EMPRESAS_PRODUCTO = 'SET_EMPRESAS_PRODUCTO';

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_PRODUCTO, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.productos.buscador;
    const filtro = store.productos.filtro_producto;
    let params = {page, search};

    if(filtro){
        params['empresa'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}`, params).catch((error) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_PRODUCTO, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_PRODUCTO, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_PRODUCTO, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        if(error.statusCode  === 404){
            dispatch(push('/admin_productos'))
        }
        dispatch({type: LOADER_PRODUCTO, cargando: false});
    }).then((data) => {
        if(data){
            let unidad = data.fracciones[0];
            delete unidad.id;
            data.fracciones.splice(0,1);
            data = {...data, ...unidad}
            dispatch({type: SET_UPDATE_DATA_PRODUCTO, updateData: data});
            dispatch(initializeForm('producto', data))
        }
        dispatch({type: LOADER_PRODUCTO, cargando: false});
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.producto.values;
    dispatch({type: LOADER_PRODUCTO, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
        Swal('Éxito', 'Se ha creado el producto.', 'success')
        .then(() => {
            dispatch(push('/productos'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
    });
};
const update = () => (dispatch, getStore) => {
    const formData = getStore().form.producto.values;
    const productos = getStore().productos.updateData;
    let errroPrecios = false;
    let fraccionesBorradas = productos.fracciones.filter((el) => {
        if (formData.fracciones.find(x => x.id === el.id)) {
            return
        }
        return el
    })
    let preciosBorrados = productos.precios.filter((el) => {
        if(formData.precios.find(x => x.moneda === el.moneda)){
            return
        }
        return el
    });
    formData.preciosBorrados = preciosBorrados;
    formData.borrados = fraccionesBorradas;
    formData.fracciones.map((fraccion) =>{
        productos.fracciones.map((fraccionUpdate) => {
            let borradosPrecios = fraccionUpdate.precios.filter((el) => {
                if(fraccion.precios.find(x => x.moneda === el.moneda)){
                    return
                }
                return el
            })
             fraccion.preciosBorrados = borradosPrecios

        });
        if(!fraccion.precios || fraccion.precios.length === 0){
            errroPrecios = true
        }
    })
    if(errroPrecios){
        Swal(
            'Precio múltiplos',
            'Verifique que los múltiplos tienen un precio',
            'error'
          );
          return
    }

    // productos.fracciones.map((fraccion) => {
    //     let precioBorrado = fraccion.precios.filter((el) => {
    //         if (formData.fracciones.precios.find(x => x.moneda === el.moneda)){
    //             return
    //         }
    //         return el
    //     })
    //     form
    // });

    dispatch({type: LOADER_PRODUCTO, cargando: true})
    api.put(`${url}/${formData.id}`, formData).then((data) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
        Swal('Éxito', 'Se ha actualizado el producto.', 'success')
        .then(() => {
            dispatch(push('/productos'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
        dispatch(push('/productos'))
    }).finally(() => {
        dispatch({type: LOADER_PRODUCTO, cargando: false})
    });
};
const borrar = (id) => (dispatch, getState) => {
    dispatch({type: LOADER_PRODUCTO, cargando: true});
    api.eliminar(`productos/${id}`).catch((error) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false});
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(push('/admin_productos'));
            });
    }).then((data) => {
        dispatch({type: LOADER_PRODUCTO, cargando: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listar(1));
            })
    });
}
const getEmpresasSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`proyectos/getEmpresasSelect`, params).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: SET_EMPRESAS_PRODUCTO, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_PRODUCTO, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_PRODUCTO, filtro_producto: filtro});
    dispatch(listar(1));
};


export const actions = {
    listar,
    detail,
    create,
    search,
    update,
    borrar,
    getEmpresasSelect,
    filtro

};

export const reducer = {
    [LOADER_PRODUCTO]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_PRODUCTO]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_PRODUCTO]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_PRODUCTO]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_PRODUCTO]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_PRODUCTO]: (state, { filtro_producto }) => {
        return {...state, filtro_producto }
    },
    [SET_EMPRESAS_PRODUCTO]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    }
}

export const initialState = {
    cargando: false,
    page: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    filtro_producto: null,
    updateData: {},
    empresasSelect:[]
};

export default handleActions(reducer, initialState)
