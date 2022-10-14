import React, {ChangeEvent, FormEvent} from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {deleteItem, saveItem, selectCurrentItem, setCurrentItem, updateCurrentItem} from "../ducks/map";
import {Alert, FormColumn} from "chums-components";
import {FBAItem} from "chums-types";

const ItemEditor = () => {
    const dispatch = useAppDispatch();
    const item = useSelector(selectCurrentItem);

    const submitHandler = (ev:FormEvent) => {
        ev.preventDefault();
        if (!item) {
            return;
        }
        dispatch(saveItem(item));
    }

    const fieldChangeHandler = (field: keyof FBAItem) => (ev:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCurrentItem({[field]: ev.target.value}));
    }

    const onNewItem = () => {
        dispatch(setCurrentItem({
            sku: '',
            itemCode: '',
            active: true,
            warehouseCode: 'AMZ',
            company: 'chums',
            itemCodeDesc: 'unsaved item'
        }));
    }

    const onDeleteItem = () => {
        if (!item || !window.confirm(`Are you sure you want to delete mapping: ${item.sku}?`)) {
            return;
        }
        dispatch(deleteItem(item));
    }

    return (
        <form onSubmit={submitHandler}>
            <FormColumn label={"Amazon SKU"} width={8}>
                <input type="text" className="form-control form-control-sm" required
                       value={item?.sku ?? ''} onChange={fieldChangeHandler('sku')} />
            </FormColumn>
            <FormColumn label={"Chums Item Code"} width={8}>
                <input type="text" className="form-control form-control-sm" required
                       value={item?.itemCode ?? ''} onChange={fieldChangeHandler('itemCode')} />
                <small className="text-muted">{item?.itemCodeDesc}</small>
                {!!item && !item.active && (<Alert color="warning">Item is inactive</Alert>)}
            </FormColumn>
            <FormColumn label=" " width={8}>
                <div className="row g-3">
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary btn-sm" disabled={!item}>Save Item</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onNewItem}>New Item</button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-outline-danger btn-sm" disabled={!item?.sku} onClick={onDeleteItem}>Delete Item</button>
                    </div>
                </div>

            </FormColumn>
        </form>
    )
}

export default ItemEditor;
