import React from 'react'
import { useObserver } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "./CustomTableStore"
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Paper from '@material-ui/core/Paper'

interface CustomTableContainerProps {
    children: React.ReactElement
}

export const CustomTableContainer = <RowData extends Object>(props: CustomTableContainerProps) => {

    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)

    const component = useObserver(() => {
        const hasContainer = rootStore.fullscreen || (rootStore.sp.hasContainer === undefined || rootStore.sp.hasContainer === true)
        return (hasContainer ? (
            <Paper style={{ minHeight: rootStore.minHeight, display: 'flex', flexDirection: 'column' }} >
                {props.children}
            </Paper>
        ) : (
                <div style={{ minHeight: rootStore.minHeight, display: 'flex', flexDirection: 'column' }} >
                    {props.children}
                </div>
            ))
    })

    return useObserver(() => {
        return (
            rootStore.fullscreen ? (
                <Dialog open={true} fullScreen onClose={rootStore.toggleFullscreen}>
                    <DialogContent>
                        {component}
                    </DialogContent >
                </Dialog >
            ) : component
        )
    })
}