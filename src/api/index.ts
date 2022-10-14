import {FBAItem, FBAItemMap} from "chums-types";
import {fetchJSON} from "chums-components";

export async function fetchItemMap():Promise<FBAItemMap> {
    try {
        const {itemMap} = await fetchJSON<{itemMap:FBAItemMap}>('/api/partners/amazon/seller-central/fba/item-map');
        return itemMap;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchItemMap()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchItemMap()", err);
        return Promise.reject(new Error('Error in fetchItemMap()'));
    }
}

export async function postItemMap(item:FBAItem):Promise<FBAItemMap> {
    try {
        const body = JSON.stringify(item);
        const {itemMap} = await fetchJSON<{itemMap:FBAItemMap}>('/api/partners/amazon/seller-central/fba/item-map', {method: 'POST', body});
        return itemMap;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postItemMap()", err.message);
            return Promise.reject(err);
        }
        console.debug("postItemMap()", err);
        return Promise.reject(new Error('Error in postItemMap()'));
    }
}

export async function deleteItemMap(item:FBAItem):Promise<FBAItemMap> {
    try {
        const url = '/api/partners/amazon/seller-central/fba/item-map/:sku'
            .replace(':sku', encodeURIComponent(item.sku));
        const {itemMap} = await fetchJSON<{itemMap:FBAItemMap}>(url, {method: 'DELETE'});
        return itemMap;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteItemMap()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteItemMap()", err);
        return Promise.reject(new Error('Error in deleteItemMap()'));
    }
}
