import React from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import { CustomTableLocalRow } from '../CustomTableLocalRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import { useStylesRowClosedNoBorder } from './shared-styles'


interface CustomTableCollapsibleDetailsProps<RowData extends Object> {
    localRow: CustomTableLocalRow<RowData>
}

export const CustomTableCollapsibleDetails = <RowData extends Object>(props: CustomTableCollapsibleDetailsProps<RowData>) => {
    const classes = useStylesRowClosedNoBorder()

    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        get collapsibleDetailStyling() {
            const style = { ...(sp.localRow.collapsibleConfig || {}) } as React.CSSProperties
            if (!sp.localRow.collapsibleOpen) {
                style.paddingTop = '0px'
                style.paddingBottom = '0px'
            }
            style.transitionProperty = 'padding-top, padding-bottom'
            style.transitionDuration = '0.2s'
            return style
        },
        get trStyling() {
            if (sp.localRow.collapsibleOpen) {
                return {}
            } else {
                return {
                    height: '0px'
                }
            }
        },
    }), { rootStore, ...props })

    return useObserver(() => {
        if (!rootStore.hasCollapsibleRowDetail) {
            return null
        }

        const style = (props.localRow.collapsibleOpen ? {
            maxHeight: 10000,
            transition: 'max-height 0.1s',
        } : {
                maxHeight: 0,
                boxSizing: 'border-box',
                overflow: 'hidden',
                transition: 'max-height 0.1s',
            }) as React.CSSProperties

        const cellClass = (props.localRow.collapsibleOpen ? classes.cellOpened : classes.cellClosed)

        return (
            <TableBody>
                <TableRow>
                    <TableCell className={cellClass} style={store.collapsibleDetailStyling} >

                    </TableCell>
                    <TableCell className={cellClass} style={store.collapsibleDetailStyling} colSpan={rootStore.sp.columns.length + 1}>
                        <div style={style}>
                            {props.localRow.collapsibleConfig.render}
                        </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    })
}