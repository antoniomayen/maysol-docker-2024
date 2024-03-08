import React from 'react';
import LoadMask from '../LoadMask';

function CardGrandeForm(props) {
    return (
        <div className="row d-flex justify-content-center">
            <div className="border-completo card col-11 ">
                <div className="title d-flex justify-content-center text-left">
                    <div className="col-md-11 d-flex flex-row mt-2">
                        <h3 className="text-uppercase"><strong>{props.titulo}</strong></h3>
                    </div>
                </div>

                    <div className="card-body d-flex justify-content-center">
                            <div className="col-md-12">
                                {props.children}
                            </div>
                    </div>
            </div>
        </div>
    )
}

export default CardGrandeForm;
