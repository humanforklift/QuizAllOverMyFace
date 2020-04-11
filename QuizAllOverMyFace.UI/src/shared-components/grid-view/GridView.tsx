import React, { useMemo } from "react"
import { useObserver, } from "mobx-react-lite"
import useWindowSize from "../hooks/useWindowSize"
import { GridViewStore } from "../grid-view"
import { GridViewListRequest, GridViewListResponse } from "./GridViewStore"
import { CustomTable } from "../material-ui-table"

interface GridViewProps<ListType extends Object, ListRequestType extends GridViewListRequest, ListResponseType extends GridViewListResponse> {
    store: GridViewStore<ListType, ListRequestType, ListResponseType>
    title: string | React.ReactElement
}

export function GridView<ListType extends Object, ListRequestType extends GridViewListRequest, ListResponseType extends GridViewListResponse>
    (props: GridViewProps<ListType, ListRequestType, ListResponseType>) {

    const [store, title] = useObserver(() => [props.store, props.title] )
    const windowSize = useWindowSize()
    
    const [
        tableActions,
        fetchRequest,
        pageSize,
        gridDefinition,
        rows,
        totalCount,
        setReloadFunction,
    ] = useObserver(() =>
        [
            store.tableActions,
            store.fetchRequest,
            store.pageSize,
            store.gridDefinition,
            store.rows,
            store.totalCount,
            store.setReloadFunction
        ])

    const table = useMemo(() =>
        <CustomTable
            maxHeight={windowSize.height - 74}
            minHeight={windowSize.height - 74}
            columns={gridDefinition}
            rows={rows}
            totalCount={totalCount}
            remoteDataFetchRequest={fetchRequest}
            title={title}
            actions={tableActions}
            pageSize={pageSize}
            searchDebounceInterval={500}
            sortable={true}
            setReloadFunction={setReloadFunction}
        />
        , [tableActions,
            gridDefinition,
            title,
            fetchRequest,
            pageSize,
            windowSize.height,
            rows,
            totalCount,
            setReloadFunction,
        ])

    return useObserver(() =>
        <>
            {table}
        </>
    )
}