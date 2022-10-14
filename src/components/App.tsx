import React, {useEffect} from "react";
import {useAppDispatch} from "../app/configureStore";
import {loadItems, selectLoaded} from "../ducks/map";
import {useSelector} from "react-redux";
import ItemTable from "./ItemTable";
import ItemEditor from "./ItemEditor";
import {AlertList} from "chums-connected-components";

const App = () => {
    const dispatch = useAppDispatch();
    const loaded = useSelector(selectLoaded);

    useEffect(() => {
        if (!loaded) {
            dispatch(loadItems());
        }
    }, [])

    return (
        <div className="row g-3">
            <div className="col-6">
                <h3>Items</h3>
                <ItemTable />
            </div>
            <div className="col-6">
                <h3>Item Editor</h3>
                <AlertList />
                <ItemEditor />
            </div>
        </div>
    )
}
export default App;
