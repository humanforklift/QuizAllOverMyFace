import React, { useRef, useEffect } from 'react'
import { useLocalStore, useObserver } from "mobx-react-lite"
import Table from "@material-ui/core/Table"
import { CustomTableStoreContext, CustomTableStore } from "./CustomTableStore"
import { CustomTableToolbar } from './toolbar/CustomTableToolbar'
import { CustomTableHead } from './header/CustomTableHead'
import { CustomTableBody } from './body/CustomTableBody'
import { CustomTableBodyNoResults } from './body/CustomTableBodyNoResults'
import { CustomTablePagination } from './footer/CustomTablePagination'
import useInitialMount from '../hooks/useInitialMount'
import useWindowSize from '../hooks/useWindowSize'
import { CustomTableContainer } from './CustomTableContainer'

export const CustomTable = <RowData extends Object>({
    pageSizeOptions = [5, 10, 20, 50, 100, 200],
    pagination = true,
    sortable = true,
    ...props
}: CustomTableProps<RowData>) => {

    const windowSize = useWindowSize()
    const componentHeaderRef = useRef<HTMLDivElement>(null)
    const paginationDivRef = useRef<HTMLDivElement>(null)
    const store = useLocalStore(sp => new CustomTableStore<RowData>(sp), { ...props, pageSizeOptions, pagination, sortable, windowSize })

    // initial data load
    useInitialMount(() => {
        if (store.isRemoteData && (props.loadRemoteDataOnInit === undefined || props.loadRemoteDataOnInit === true)) {
            store.dataFetch('initial-mount')
        }
    })

    const maxHeight = useObserver(() => store.maxHeight)

    const componentHeaderHeight = (componentHeaderRef.current && componentHeaderRef.current.clientHeight) || 0

    // calculating the header cell top value to properly be sticky together with the toolbar
    useEffect(() => {
        const divTop = componentHeaderHeight
        store.setHeaderCellTopValue(divTop + 'px')
    }, [componentHeaderHeight])// eslint-disable-line react-hooks/exhaustive-deps

    const pagHeight = ((pagination && paginationDivRef!.current) ? paginationDivRef!.current.clientHeight : 0)
    // calculating the pagination box minimum height depending on the whole component height
    useEffect(() => {
        if (store.hasScrolling) {
            const divMaxHeight = maxHeight - pagHeight
            store.setDivMaxHeight(divMaxHeight)
        }
        store.setPaginationBoxMinHeight(pagHeight + 'px')

    }, [maxHeight, store.hasScrolling, pagHeight])// eslint-disable-line react-hooks/exhaustive-deps

    // whenever there is a change of rows this will update the component inner rows (or when it's the first time)
    useEffect(() => {
        if (!store.isRemoteData) {
            store.loading = true
        }
        setTimeout(() => {
            store.setLocalRows(props.rows)
            if (!store.isRemoteData) {
                store.dataFetch('data-change')
            }
        })
    }, [props.rows, store.isRemoteData])// eslint-disable-line react-hooks/exhaustive-deps

    const { setReloadFunction } = props

    // sets the parent's reload function
    useEffect(() => {
        setReloadFunction && setReloadFunction(() => store.dataFetch('forced-reload'))
    }, [setReloadFunction, store.dataFetch, store])

    // forces the page size value when the prop changes or it's the first time
    useEffect(() => {
        if (props.pageSize) {
            store.rowsPerPage = props.pageSize
        }
    }, [props.pageSize])// eslint-disable-line react-hooks/exhaustive-deps

    // if the column changes or it's the first time, sets the default column sorting
    useEffect(() => {
        for (let index = 0; index < props.columns.length; index++) {
            const column = props.columns[index];
            if (column.defaultSort) {
                store.columnSortingDirection = column.defaultSort
                store.columnSortingIndex = index
                break
            }
        }
    }, [props.columns])// eslint-disable-line react-hooks/exhaustive-deps

    // ** sets the default search string
    useEffect(() => {
        store.searchString = props.initialSearch || ""
    }, [props.initialSearch])// eslint-disable-line react-hooks/exhaustive-deps

    // always have a reference to the max count so far, so the page options can be determined in a more stable way.
    useEffect(() => {
        let count = 0
        if (store.isRemoteData) {
            count = props.totalCount || 0
        } else {
            count = props.rows.length
        }
        if (count > store.maxCount) {
            setTimeout(() => store.maxCount = count)
        }
    }, [store.isRemoteData, props.totalCount, props.rows])// eslint-disable-line react-hooks/exhaustive-deps

    return useObserver(() => (
        <CustomTableStoreContext.Provider value={store as any}>
            <CustomTableContainer>
                <>
                    <div style={{ display: 'grid', maxHeight: store.divMaxHeight, overflow: (store.hasScrolling ? 'auto' : undefined) }}>
                        <CustomTableToolbar componentHeaderRef={componentHeaderRef} />

                        <Table style={store.tableStyle} size={store.size}>
                            <CustomTableHead />
                            <CustomTableBody />
                        </Table>

                        <CustomTableBodyNoResults />
                    </div>
                    <CustomTablePagination paginationDivRef={paginationDivRef} />
                </>
            </CustomTableContainer>
        </CustomTableStoreContext.Provider>
    ))
}

export interface CustomTableProps<RowData extends Object> {
    /**
     * pass on a function that will receive CustomTable's reload function, in case you want to call the reload function yourself
     */
    setReloadFunction?: (reloadFunction: () => any) => any
    /**
     * free actions, single row actions and multiple row actions
     */
    actions?: CustomTableActions<RowData>
    /**
     * table's columns
     */
    columns: Column<RowData>[]
    /**
     * rows columns. If you are using paginatedDataFetchRequest, then you provide the paginated subset of your rows whenever props.paginatedDataFetchRequest 
     * is called - this is usually used for remote fetched data. Otherwise, please you can provide all the rows and CustomTable will paginate for you
     */
    rows: RowData[]
    /**
     * if all your rows are local, and you want CustomTable to handle all searching, pagination and ordering, this prop should NOT be used.
     * if your rows are fetched from somewhere else (as an API), the data search, pagination and ordering is usually done on the server - that's the case when
     * you should use the remoteDataFetchRequest prop. Whenever CustomTable needs you (the caller) to fetch new data 
     * this callback will be called. Ensure to return a promise that will be only be fulfilled when the data fetching ended, because the loading mechanism
     * relies on that. An async function will do the trick beautifully. This callback will be called when:
     *  1) the search changed;
     *  2) the ordering changed or 
     *  3) the pagination changed
     */
    remoteDataFetchRequest?: (props: RemoteDataFetchProps<RowData>) => Promise<any | void>
    /**
     * when using remoteDataFetchRequest, you should let CustomTable know about what's the totalCount the server returned to you
     */
    totalCount?: number
    /**
     * CustomTable already has mechanisms to give visual feedback when loading stuff (check remoteDataFetchRequest prop out) but you can force loading
     * through this. The values 'true' and 'false' will override any behaviour. CustomTable will have its behaviour restored if you pass undefined.
     */
    forceIsLoading?: boolean
    /**
     * Whether you want CustomTable to load the initial remote data as soon as it mounts. Defaults to true
     */
    loadRemoteDataOnInit?: boolean
    /**
     * title above the table. Can be a string or an element
     */
    title?: string | React.ReactElement<any>
    /** anything you would like to render between the toolbar and the table. Usually good for additional search fields */
    renderBetweenToolbarAndTable?: React.ReactElement<any> | null
    /**
     * this will be called when the user clicks or taps on a row
     */
    onRowClick?: (rowData: RowData) => void;
    /**
     * this defines whether this table will support row selection (needed for multiple row actions)
     */
    selectable?: boolean
    /**
     * if you want to preserve selection when the rows are updated. This might give some performance penalties
     */
    preserveSelectionWhenRowsUpdated?: boolean
    /**
     * this will be called when the user tries to select a row. If you return false, the selection won't take place
     */
    willToggleRowSelection?: (rowData: RowData, selected: boolean) => (Promise<boolean | undefined>)
    /**
     * this will be called when a single row selection took place
     */
    onRowSelectionToggle?: (rowData: RowData, selected: boolean) => void
    /**
     * this will be called when the user selected or deselected all rows, or just all rows in a page
     */
    onSelectAll?: (variant: 'select-all' | 'select-page-all' | 'deselect-all', pageRows?: RowData[]) => any | void
    /**
     * just in case you need a reference to the table element
     */
    tableRef?: React.Ref<HTMLTableElement>
    /**
     * how long (in ms) should CustomTable wait until starting the search after the user typed in the search field
     */
    searchDebounceInterval?: number
    /**
     * would you like pagination or not?
     */
    pagination?: boolean
    /**
     * what's the initial value for the page size?
     */
    pageSize?: number
    /**
     * what are the page size options?
     */
    pageSizeOptions?: number[]
    /**
     * is it possible for the user to select all rows?
     */
    showSelectAllCheckbox?: boolean
    /**
     * is this table searchable? (like, should CustomTable display a search field?)
     */
    searchable?: boolean
    /**
     * when data is local (not remote) you can pass in this function that will return whether the row complies with the current filter
     */
    customLocalSearch?: (row: RowData, searchText: string) => boolean
    /** in case you need the table to initiate with a string search already in place */
    initialSearch?: string
    /** is this table sortable?    */
    sortable?: boolean
    /** CustomTable already has mechanisms to determine whether the table should have a refresh button, but you can force
     * by passing 'true' or 'false'.     */
    forceHasRefresh?: boolean
    /** some styling properties    */
    styling?: StylingProps<RowData>
    /** define a max height for the table. That will cause the header to be sticky to the top when scrolling down.     */
    maxHeight?: number
    /** define a min height for the table. That will cause the header to be sticky to the top when scrolling down.     */
    minHeight?: number
    /** whether CustomTable will use Paper as a container (true) or you will provide your own container (false) */
    hasContainer?: boolean
    /** density */
    size?: 'small' | 'medium'
    /** configuration for row collapsible details */
    collapsibleDetailConfig?: (row: RowData) => CustomTableCollapsibleDetailConfig | undefined
    /** if true, CustomTable will show a button for toggling the fullscreen mode for that table*/
    fullscreenable?: boolean
    /** show controls for the user to change the table size/padding/density/whatever you wanna call */
    userCanToggleSize?: boolean
}

export interface CustomTableCollapsibleDetailConfig {
    /** you should return true for every row that needs a collapsible detail toggle */
    rowHasCollapsibleDetail?: boolean
    /** what should be rendered underneath the row when the collapsible is open */
    render?: React.ReactElement
    /** whether the toggle starts as opened. Default: false */
    rowStartsOpened?: boolean
    /** the tooltip for the detail toggle button. Default: 'Details' */
    toggleTooltip?: string
    /** the styling for the cell that contains the collapsible detail. Note: it already has colspan enough to span throughout all the cells */
    collapsibleDetailStyling?: React.CSSProperties
}

export type KeysOfType<T, TProp> = { [P in keyof T]: T[P] extends TProp ? P : never }[keyof T]

export type FreeActionProp<RowData extends Object> = FreeActionType<RowData>
export type RowActionProp<RowData extends Object> = RowActionType<RowData> | ((row: RowData) => RowActionType<RowData> | undefined)
export type MultipleRowActionProp<RowData extends Object> = MultipleRowActionType<RowData> | ((rows: RowData[]) => MultipleRowActionType<RowData> | undefined)

export interface CustomTableActions<RowData extends Object> {
    /**
     * actions that can be taken that are not related to one or more rows (like, a 'create' action)
     */
    freeActions?: FreeActionProp<RowData>[]
    /**
     * actions that are related to a single row (like, an 'edit' action)
     */
    rowActions?: RowActionProp<RowData>[]
    /**
     * actions that can be related to multiple rows (like a 'delete' action)
     */
    multipleRowActions?: MultipleRowActionProp<RowData>[]
}
export interface FreeActionType<RowData extends Object> extends Action<RowData> {
    callback: () => any
    icon: (() => React.ReactElement<any>)
}
export interface RowActionType<RowData extends Object> extends Action<RowData> {
    callback: (data: RowData) => any
}
export interface MultipleRowActionType<RowData extends Object> extends Action<RowData> {
    callback: (data: RowData[]) => any
    icon: (() => React.ReactElement<any>)
}

export interface Action<RowData extends Object> {
    disabled?: boolean
    title?: string
    hidden?: boolean
}

export interface RemoteDataFetchProps<RowData extends Object> {
    pageSize: number
    page: number
    sortField?: keyof RowData
    sortDirection?: ('asc' | 'desc')
    searchString: string
}

export interface StylingProps<RowData extends Object> {
    /**
     * table styling props
     */
    style?: React.CSSProperties
    /**
     * table header (thead) styling props
     */
    headerStyle?: React.CSSProperties
    /**
     * table header row (tr) styling props
     */
    headerRowStyle?: React.CSSProperties
    /**
     * each row's (td in tbody) styling props
     */
    rowStyle?: React.CSSProperties | ((data: RowData) => React.CSSProperties)
    /**
     * search field styling props (material-ui Input component)
     */
    searchFieldStyle?: React.CSSProperties
    /**
     * search field inner input styling props
     */
    searchFieldInputStyle?: React.CSSProperties
}

export interface Column<RowData extends Object> {
    /**
     * the field that should be used for this column. CustomTable will try to render from the field directly 
     * if you don't use the `render` property
     */
    field?: keyof RowData
    /**
     * if you want a more fine-grained control over what will be render for this column, you can use this property.
     * You will receive the column and you can return anything, even a complex element
     */
    render?: (data: RowData) => React.ReactElement | string | number | undefined | void | null
    /**
     * if you render is a react element, you might want to let CustomTable know about the "raw data" version of your data,
     * so the searching and sorting can be applied over it. This will be converted to string so it can be searchable.
     */
    rawDataForSearchingAndSorting?: (rowData: RowData, columnDef: Column<RowData>) => any
    /**
     * if your field is, for example, a number or a date, you might want to return its content from this function, as this 
     * won't convert to string (as the more generic `rawDataForSearchingAndSorting` does), and will be compared as is for sorting
     */
    rawDataForSorting?: (rowData: RowData, columnDef: Column<RowData>) => any
    /**
     * should this column start as the initial sorting constraint?
     */
    defaultSort?: ('asc' | 'desc')
    /**
     * is this column hidden?
     */
    hidden?: boolean
    /**
     * whether this column should be considered when the user searches using the search field
     */
    searchable?: boolean
    /**
     * when data is local (not remote) you can pass in this function that will return whether the row and column complies with the current filter
     * @param row the row that is being evaluated
     * @param searchText the string that the user typed in the search field
     * @param processedRawData the raw data from that column, that CustomTable would usually use for filtering. It is a series of precedences between the
     * column properties evaluated: rawDataForSearchingAndSorting, render and field.
     */
    columnCustomLocalSearch?: (row: RowData, searchText: string, processedRawData?: string) => boolean
    /**
     * is this column sortable?
     */
    sortable?: boolean
    /**
     * what's the column's title?
     */
    title?: string | React.ReactElement<any>
    /**
     * column's header (th) styling props
     */
    headerStyle?: React.CSSProperties
    /**
     * each cell's (td) styling props
     */
    cellStyle?: React.CSSProperties | ((rowData: RowData) => React.CSSProperties)
    /**
     * column alignment
     */
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'

}