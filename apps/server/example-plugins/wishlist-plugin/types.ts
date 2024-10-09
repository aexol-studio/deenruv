import { CustomCustomerFields } from '@deenruv/core/dist/entity/custom-entity-fields';

import { WishlistItem } from './entities/wishlist-item.entity';

declare module '@deenruv/core/dist/entity/custom-entity-fields' {
    interface CustomCustomerFields {
        wishlistItems: WishlistItem[];
    }
}
