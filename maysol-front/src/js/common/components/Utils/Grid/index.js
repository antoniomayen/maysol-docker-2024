import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BootstrapTable } from 'react-bootstrap-table';
import LoadMask from "../LoadMask";


function rowClassNameFormat(row, rowIdx) {
    // row is whole row object
    // rowIdx is index of row
    return rowIdx % 2 === 0 ? 'strikeout' : 'strikeout';
  }

export default class Grid extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onPageChange: PropTypes.func,
        onSortChange: PropTypes.func,
    }

    static defaultProps = {
        loading: false
    }

    parseData(data, page) {
        // this method parses the data and extracts:
        // total: the total number of rows
        // page: the current page
        // pageSize: the page size
        // rows: rows for the table
        return {
            total: data.count,
            page: page,
            pageSize: 10,
            rows: data.results
        }
    }

    render() {
        // state
        const {
            // state
            loading, data, page, expandableRow, expandComponent, cellEditProp,afterSave,
            // bind
            onPageChange, onSortChange,pagination,
            // other
            ...other
        } = this.props;
        const { rows, count } = this.parseData(data, page);

        // render
        const options = {
            sizePerPage: 10,
            hideSizePerPage: true,
            paginationSize: 20,
            alwaysShowAllBtns: true,
            noDataText: loading ? 'Cargando...' : 'No hay datos',
            page,
            onPageChange: onPageChange ? onPageChange : () => {},
            onSortChange: onSortChange ? onPageChange : () => {}
        };
        let paginar = true;
        if(pagination=== false){
            paginar = false
        }
        return (
            <div>
                <LoadMask loading={loading} dark blur>
                    <BootstrapTable
                        expandableRow={ expandableRow  }
                        expandComponent={ expandComponent }
                        cellEdit={cellEditProp}
                        data={loading ? [] : data.results}
                        afterSaveCell={ afterSave }
                        remote pagination={paginar} hover
                        fetchInfo={{ dataTotalSize: data.count }} options={options} {...other}>
                    </BootstrapTable>
                </LoadMask>
            </div>

        )
    }
}
