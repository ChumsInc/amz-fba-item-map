import {FBAItem} from "chums-types";
import {
    addPageSetAction,
    ConnectedPager,
    ConnectedTable,
    SortableTableField,
    tableAddedAction
} from "chums-connected-components";
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {
    FBAItemSorter,
    itemTableId,
    selectCurrentItem,
    selectItemsLength,
    selectPagedItemMap,
    setCurrentItem
} from "../ducks/map";
import React, {useEffect} from "react";
import classNames from "classnames";

export interface FBAItemField extends SortableTableField {
    field: keyof FBAItem
}

const fields: FBAItemField[] = [
    {field: 'sku', title: 'Amazon Seller SKU', sortable: true},
    {field: 'warehouseCode', title: 'Warehouse Code', sortable: true},
    {field: 'itemCode', title: 'Chums Item Code', sortable: true},
    {field: 'itemCodeDesc', title: 'Amazon Seller SKU', sortable: true},
];

const initialSort: FBAItemSorter = {field: 'sku', ascending: true};

const rowClassName = (row:FBAItem) => {
    return classNames({
        'text-danger': !row.active,
    })
}

const ItemTable = () => {
    const dispatch = useAppDispatch();
    const rows = useSelector(selectPagedItemMap);
    const length = useSelector(selectItemsLength);
    const currentItem = useSelector(selectCurrentItem);

    useEffect(() => {
        dispatch(tableAddedAction({key: itemTableId, field: 'sku', ascending: true}));
        dispatch(addPageSetAction({key: itemTableId}));
    }, []);

    const onSelectRow = (row:FBAItem) => {
        dispatch(setCurrentItem(row));
    }

    return (
        <div>
            <ConnectedTable tableKey={itemTableId} defaultSort={initialSort} fields={fields} data={rows}
                            keyField={'sku'} size="xs" rowClassName={rowClassName} onSelectRow={onSelectRow} selected={(row) => currentItem?.sku === row.sku}/>
            <ConnectedPager pageSetKey={itemTableId} dataLength={length}/>
        </div>
    )
}

export default ItemTable;
