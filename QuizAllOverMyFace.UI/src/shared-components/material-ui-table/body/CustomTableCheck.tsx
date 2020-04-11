import React from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import Checkbox from '@material-ui/core/Checkbox'
import { action } from 'mobx'
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import { CustomTableLocalRow } from '../CustomTableLocalRow'

interface CustomTableCheckProps<RowData extends Object> {
    row: CustomTableLocalRow<RowData>
}

export const CustomTableCheck = <RowData extends Object>(props: CustomTableCheckProps<RowData>) => {

    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        onClick: action((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            rootStore.toggleRowSelection(sp.row)
            event.stopPropagation()
            event.preventDefault()
        }),
    }), props)

    return useObserver(() => {
        return (
            <Checkbox style={{ margin: '0px', padding: '0px', zIndex: 0 }} value={props.row.selected} checked={props.row.selected} onClick={store.onClick} />
        )
    })
}
