import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from '@deenruv/admin-types';

export const RemoveBadgeMutation = typedGql('mutation', { scalars })({
    removeBadge: [
        {
            input: {
                id: $('id', 'ID!'),
            },
        },
        true,
    ],
});

export const CreateBadgeMutation = typedGql('mutation', { scalars })({
    createBadge: [
        {
            input: $('input', 'CreateBadgeInput!'),
        },
        { id: true },
    ],
});
export const EditBadgeMutation = typedGql('mutation', { scalars })({
    editBadge: [
        {
            input: $('input', 'EditBadgeInput!'),
        },
        { id: true },
    ],
});
