import React, { useContext } from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import { RowActionType } from '../CustomTable'
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import TableCell from '@material-ui/core/TableCell'
import { useStylesRowOpenedNoBorder } from './shared-styles'
import { CustomTableLocalRow } from '../CustomTableLocalRow'
import { SplitButton } from '../../material-ui-split-button'

interface CustomTableRowActionCellProps<RowData extends Object> {
    localRow: CustomTableLocalRow<RowData>
}

export const CustomTableRowActionCell = <RowData extends Object>(props: CustomTableRowActionCellProps<RowData>) => {
    const classes = useStylesRowOpenedNoBorder()
    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const store = useLocalStore(sp => ({
        get hasRowActions() {
            return sp.actions.length > 0
        },
        get actionCellContent() {
            const options = []
            if (sp.actions) {
                for (const action of sp.actions) {
                    let realAction: RowActionType<RowData> | undefined
                    if (typeof (action) !== "function") {
                        realAction = action
                    } else {
                        realAction = action(sp.localRow.row)
                    }
                    if (!!realAction) {
                        options.push({
                            title: realAction.title || "",
                            callback: (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
                                realAction!.callback(sp.localRow.row)
                                event.stopPropagation()
                            }
                        })
                    }
                }
            }
            if (options.length > 0) {
                return (
                    <SplitButton options={options} />
                )
            }
            return null
        },
    }), { actions: rootStore.rowActions, ...props })

    return useObserver(() => {
        if (!store.hasRowActions) {
            return null
        }
        return (
            <TableCell className={props.localRow.collapsibleOpen ? classes.cellOpened : classes.cellClosed} >
                {store.actionCellContent}
            </TableCell>
        )
    })
}
