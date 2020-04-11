import React, { useContext } from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import TableCell from "@material-ui/core/TableCell"
import { CustomTableStore, CustomTableStoreContext } from '../CustomTableStore'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

export const CustomTableHeaderCollapseCell = <RowData extends Object>() => {

    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        get headerCellStyle() {
            return {
                position: 'sticky',
                top: rootStore.headerCellTopValue,
                zIndex: 1,
                backgroundColor: 'white',
                whiteSpace: 'nowrap',
                width: '1%',
                padding: '0px',
                borderCollapse: 'separate',
            } as React.CSSProperties
        },
        get open() {
            for (const localRow of rootStore.localRows) {
                if (localRow.collapsibleConfig.rowHasCollapsibleDetail) {
                    return localRow.collapsibleOpen
                }
            }
            return undefined
        },
        get tooltip() {
            return (store.open ? "Close All" : "Open All")
        },
        toggle() {
            rootStore.loading = true
            setTimeout(() => {
                const open = !store.open
                for (const localRow of rootStore.localRows) {
                    if (localRow.collapsibleConfig.rowHasCollapsibleDetail) {
                        localRow.collapsibleOpen = open
                    }
                }   
                rootStore.loading = false
            });
        },
    }), {})

    return useObserver(() => (rootStore.hasCollapsibleRowDetail ? (
        <TableCell
            variant='head'
            style={store.headerCellStyle}
            align='center'
        >
            {store.open !== undefined && (
                <Tooltip title={store.tooltip}>
                    <IconButton onClick={store.toggle} style={{ margin: '0px' }} size={rootStore.size}>
                        {store.open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
                    </IconButton>
                </Tooltip>
            )}
        </TableCell>
    ) : null))
}
