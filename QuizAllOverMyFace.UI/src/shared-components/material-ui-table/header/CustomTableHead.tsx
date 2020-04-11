import React from 'react'
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import { CustomTableHeaderCell } from './CustomTableHeaderCell'
import { CustomTableHeaderSelectCell } from './CustomTableHeaderSelectCell'
import { CustomTableHeaderCollapseCell } from './CustomTableHeaderCollapseCell'
import TableCell from '@material-ui/core/TableCell'
import { useObserver } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"

export const CustomTableHead = <RowData extends Object>() => {

    const store = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)
    const styling = store.sp.styling || {}

    return useObserver(() => (
        <TableHead style={styling.headerStyle}>
            <TableRow style={styling.headerRowStyle}>

                <CustomTableHeaderSelectCell />
                <CustomTableHeaderCollapseCell />

                {store.sp.columns.map((column, index) => (
                    <CustomTableHeaderCell
                        key={index}
                        column={column}
                        index={index}
                    />
                ))}

                {store.rowActions.length > 0 && <TableCell style={store.actionColumnHeaderStyle}>Actions</TableCell>}

            </TableRow>
        </TableHead>
    ))
}