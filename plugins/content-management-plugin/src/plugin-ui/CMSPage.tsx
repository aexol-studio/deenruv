import React from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { useMDTX } from './mdtx';

export const CMSPage = () => {
    const { loading, ...mdtx } = useMDTX({ slug: 'about', model: 'homepage' });
    return <div className="cms-editor">{loading ? <div>Loading...</div> : <Puck {...mdtx} />}</div>;
};
