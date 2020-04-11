import React from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { action } from 'mobx'
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import { CustomTableLocalRow } from '../CustomTableLocalRow'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import TableCell from '@material-ui/core/TableCell'
import { useStylesRowOpenedNoBorder } from './shared-styles'

interface CustomTableCollapsibleToggleProps<RowData extends Object> {
    localRow: CustomTableLocalRow<RowData>
}

export const CustomTableCollapsibleToggle = <RowData extends Object>(props: CustomTableCollapsibleToggleProps<RowData>) => {
    const classes = useStylesRowOpenedNoBorder()
    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        toggleRowCollapsible: action((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!sp.localRow.collapsibleOpen) {
                sp.localRow.collapsibleOpen = true
            } else {
                sp.localRow.collapsibleOpen = false
            }
            event.stopPropagation()
            event.preventDefault()
        }),
        get tooltip() {
            return sp.localRow.collapsibleConfig.toggleTooltip || "Details"
        },
        get has() {
            return sp.localRow.collapsibleConfig.rowHasCollapsibleDetail || false
        },
    }), { ...props })

    return useObserver(() => !rootStore.hasCollapsibleRowDetail ? null : (
        <TableCell
            className={props.localRow.collapsibleOpen ? classes.cellOpened : classes.cellClosed}
            style={{ whiteSpace: 'nowrap', width: '1%', padding: '0px' }}
            align='center'
        >
            {store.has && (
                <Tooltip title={store.tooltip}>
                    <IconButton onClick={store.toggleRowCollapsible} style={{ margin: '0px' }} size={rootStore.size}>
                        {props.localRow.collapsibleOpen ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </IconButton>
                </Tooltip>
            )}
        </TableCell>
    ))
}