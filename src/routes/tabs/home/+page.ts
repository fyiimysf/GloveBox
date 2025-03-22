import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    if (params !== null) {
        return {
            viewFull: true
        }
    }
    else {
        error(404, 'Not found');
    }
};