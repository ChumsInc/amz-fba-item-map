import {FBAItem, FBAItemMap} from "chums-types";
import {createAction, createAsyncThunk, createReducer, createSelector} from "@reduxjs/toolkit";
import {deleteItemMap, fetchItemMap, postItemMap} from "../../api";
import {RootState} from "../../app/configureStore";
import {onErrorAction, selectPageSet, selectTableSort, SorterProps} from "chums-connected-components";
import {filterPage} from "chums-components";
import thunk from "redux-thunk";

export interface EditableFBAItem extends FBAItem {
    changed?: boolean;
    saving?: boolean;
}

export interface MapState {
    items: FBAItemMap;
    current: EditableFBAItem | null;
    loading: boolean;
    loaded: boolean;
}

export const initialMapState: MapState = {
    items: {},
    current: null,
    loading: false,
    loaded: false,
}

export const itemTableId = 'mapped-items-table';

export const setCurrentItem = createAction<FBAItem | null>('map/setItem');
export const updateCurrentItem = createAction<Partial<FBAItem>>('map/updateItem');
export const loadItems = createAsyncThunk<FBAItemMap>(
    'map/loadItems',
    async (arg, thunkAPI) => {
        try {
            return await fetchItemMap();
        } catch (err: unknown) {
            if (err instanceof Error) {
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in ()'));
        }
    })

export const saveItem = createAsyncThunk<FBAItemMap, EditableFBAItem>(
    'map/saveItem',
    async (item, thunkAPI) => {
        try {
            return await postItemMap(item);
        } catch(err:unknown) {
            if (err instanceof Error) {
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in ()'));
        }
    }
);

export const deleteItem = createAsyncThunk<FBAItemMap, EditableFBAItem>(
    'map/deleteItem',
    async (item, thunkAPI) => {
        try {
            return await deleteItemMap(item);
        } catch(err:unknown) {
            if (err instanceof Error) {
                thunkAPI.dispatch(onErrorAction(err, 'map/deleteItem'));
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in ()'));
        }
    }
)

export const mapReducer = createReducer(initialMapState, (builder) => {
    builder
        .addCase(loadItems.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadItems.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.items = action.payload;
        })
        .addCase(loadItems.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveItem.pending, (state, action) => {
            if (state.current) {
                state.current.saving = true;
            }
        })
        .addCase(saveItem.fulfilled, (state, action) => {
            state.items = action.payload;
            if (state.current) {
                state.current = action.payload[state.current.sku];
            }
        })
        .addCase(saveItem.rejected, (state) => {
            if (state.current) {
                state.current.saving =false;
            }
        })
        .addCase(deleteItem.pending, (state, action) => {
            if (state.current) {
                state.current.saving = true;
            }
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
            state.items = action.payload;
            state.current = null;
        })
        .addCase(deleteItem.rejected, (state) => {
            if (state.current) {
                state.current.saving =false;
            }
        })
        .addCase(setCurrentItem, (state, action) => {
            state.current = action.payload;
        })
        .addCase(updateCurrentItem, (state, action) => {
            if (state.current) {
                state.current = {...state.current, ...action.payload, changed: true};
            }
        })
});

export const selectLoading = (state:RootState) => state.map.loading;
export const selectLoaded = (state:RootState) => state.map.loaded;
export const selectItemMap = (state:RootState) => state.map.items;
export const selectCurrentItem = (state:RootState) => state.map.current;
export const selectCurrentSaving = (state:RootState) => state.map.current?.saving;
export const selectCurrentChanged = (state:RootState) => state.map.current?.changed;
export const selectItemsLength = (state:RootState) => Object.keys(state.map.items).length;
export const selectPagedItemMap = createSelector(
    [selectItemMap, selectTableSort(itemTableId), selectPageSet(itemTableId)],
    (items, sort, pageSet) => {
        const list = Object.values(items);
        return list.sort(itemSorter(sort as FBAItemSorter)).filter(filterPage(pageSet.page, pageSet.rowsPerPage));
    }
)


export interface FBAItemSorter extends SorterProps {
    field: keyof FBAItem,
}

export const itemSorter = (sort: FBAItemSorter) => (a: FBAItem, b: FBAItem) => {
    const mod = sort.ascending ? 1 : -1;
    switch (sort.field) {
    case 'sku':
    case 'itemCode':
    case 'warehouseCode':
        return (a[sort.field].toUpperCase() === b[sort.field].toUpperCase()
                ? (a.sku > b.sku ? 1 : -1)
                : a[sort.field].toUpperCase() > b[sort.field].toUpperCase() ? 1 : -1)
            * mod;
    case 'itemCodeDesc':
        return ((a[sort.field] ?? '').toUpperCase() === (b[sort.field] ?? '').toUpperCase()
                ? (a.sku > b.sku ? 1 : -1)
                : (a[sort.field] ?? '').toUpperCase() > (b[sort.field] ?? '').toUpperCase() ? 1 : -1)
            * mod;
    case 'active':
        return (+a[sort.field] - +b[sort.field]) * mod;
    default:
        return (a.sku > b.sku ? 1 : -1) * mod;
    }
}

export default mapReducer;
