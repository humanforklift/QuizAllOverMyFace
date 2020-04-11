import React from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import { CustomTableLocalRow } from "../CustomTableLocalRow"
import TableRow from '@material-ui/core/TableRow'
import { CustomTableRowCell } from './CustomTableRowCell'
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import TableBody from '@material-ui/core/TableBody'
import { CustomTableCollapsibleToggle } from './CustomTableCollapsibleToggle'
import { CustomTableRowSelectionCell } from './CustomTableRowSelectionCell'
import { CustomTableRowActionCell } from './CustomTableRowActionCell'
import { CustomTableCollapsibleDetails } from './CustomTableCollapsibleDetails'

interface CustomTableRowProps<RowData extends Object> {
    localRow: CustomTableLocalRow<RowData>
    rowIndex: number
}

export const CustomTableRow = <RowData extends Object>(props: CustomTableRowProps<RowData>) => {

    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        onRowClick: () => {
            rootStore.sp.onRowClick &&
            rootStore.sp.onRowClick(sp.localRow.row)
        },
        get rowStyle() {
            const styling = rootStore.sp.styling || {}
            let style = {}
            if (styling.rowStyle) {
                if (typeof (styling.rowStyle) === 'function') {
                    style = styling.rowStyle(sp.localRow.row)
                } else {
                    style = styling.rowStyle
                }
            }
            return style
        },
    }), props)

    return useObserver(() => (
        <>
            <TableBody>
                <TableRow hover={true} onClick={store.onRowClick} style={store.rowStyle}>
                    {rootStore.sp.selectable && <CustomTableRowSelectionCell localRow={props.localRow} />}

                    <CustomTableCollapsibleToggle localRow={props.localRow} />

                    {rootStore.sp.columns.map((column, index) => {
                        return <CustomTableRowCell key={index} column={column} localRow={props.localRow} rowIndex={props.rowIndex} />
                    })}

                    <CustomTableRowActionCell localRow={props.localRow} />
                </TableRow>
            </TableBody>

            <CustomTableCollapsibleDetails localRow={props.localRow} />
        </>
    ))
}