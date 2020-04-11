import React, { useMemo } from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import TableCell from "@material-ui/core/TableCell"
import { Column } from "../CustomTable"
import { useStylesRowOpenedNoBorder } from './shared-styles'
import { CustomTableLocalRow } from '../CustomTableLocalRow'

interface CustomTableRowCellProps<RowData extends Object> {
    column: Column<RowData>
    localRow: CustomTableLocalRow<RowData>
    rowIndex: number
}

export const CustomTableRowCell = <RowData extends Object>(props: CustomTableRowCellProps<RowData>) => {
    const classes = useStylesRowOpenedNoBorder()
    
    const store = useLocalStore(sp => ({
        get cellStyle() {
            let style = {}
            if (sp.column && sp.column.cellStyle) {
                if (typeof (sp.column.cellStyle) === 'function') {
                    style = sp.column.cellStyle(sp.localRow.row)
                } else {
                    style = sp.column.cellStyle
                }
            }
            return style
        },
    }), props)

    const cellStyle = useMemo(() => store.cellStyle, [store.cellStyle])

    return useObserver(() => {
        if (props.column.hidden) {
            return null
        }
        return (
            <TableCell className={props.localRow.collapsibleOpen ? classes.cellOpened : classes.cellClosed} align={props.column.align} style={cellStyle}>
                {!!props.column.render
                    ?
                    props.column.render(props.localRow.row) || null
                    :
                    !!props.column.field
                        ?
                        props.localRow.row[props.column.field]
                        :
                        ""
                }
            </TableCell>
        )
    })
}