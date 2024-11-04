import React from 'react';
import { Puck } from '@measured/puck';
import '@measured/puck/puck.css';
import { config } from '@deenruv/content-management-config';

export const CMSPage = () => {
    return (
        <div className="cms-editor">
            <Puck config={config} data={{}} onPublish={data => console.log(data)} />
        </div>
    );
};
