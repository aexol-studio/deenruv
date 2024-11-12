import React from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { useMDTX } from './mdtx';

export const CMSPage = () => {
    const { loading, ...mdtx } = useMDTX({ slug: 'post1', model: 'model_jarka' });
    return <div className="cms-editor">{loading ? <div>Loading...</div> : <Puck {...mdtx} />}</div>;
};
