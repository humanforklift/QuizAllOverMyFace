import React, { useMemo } from 'react'
import { useObserver } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import { CustomTableRow } from './CustomTableRow'

export const CustomTableBody = <RowData extends Object>() => {
    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)
    const rows = useObserver(() => rootStore.rows)
    
    return useMemo(() => (
        <>
            {rows.map((row, index) => {
                return <CustomTableRow
                    key={index}
                    localRow={row}
                    rowIndex={index}
                />
            })}
        </>
    ), [rows])
}