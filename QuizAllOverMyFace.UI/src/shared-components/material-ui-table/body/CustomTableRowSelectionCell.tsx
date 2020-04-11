import React from 'react'
import { useObserver } from "mobx-react-lite"
import TableCell from "@material-ui/core/TableCell"
import { CustomTableLocalRow } from "../CustomTableLocalRow"
import { CustomTableCheck } from './CustomTableCheck'
import { useStylesRowOpenedNoBorder } from './shared-styles'
import { useTheme } from '@material-ui/core/styles'

interface CustomTableRowSelectionCellProps<RowData extends Object> {
    localRow: CustomTableLocalRow<RowData>
}

export const CustomTableRowSelectionCell = <RowData extends Object>(props: CustomTableRowSelectionCellProps<RowData>) => {
    const classes = useStylesRowOpenedNoBorder()
    const theme = useTheme()

    return useObserver(() => (
        <TableCell
            className={props.localRow.collapsibleOpen ? classes.cellOpened : classes.cellClosed}
            style={{ whiteSpace: 'nowrap', maxWidth: '1%', paddingLeft: theme.spacing(2), paddingRight: theme.spacing(2) }}
            align='center'
        >
            <CustomTableCheck row={props.localRow} />
        </TableCell>
    ))
}