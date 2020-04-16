import { CustomTableProps, Column, MultipleRowActionType } from "./CustomTable"
import { createContext } from "react"
import { action, observable, computed } from "mobx"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import React from "react"
import RefreshIcon from '@material-ui/icons/Refresh'
import CircularProgress from "@material-ui/core/CircularProgress"
import { CustomTableMultipleRowAction } from "./toolbar/CustomTableMultipleRowAction"
import { CustomTableLocalRow } from "./CustomTableLocalRow"

interface CustomTableStoreProps<RowData extends Object> extends CustomTableProps<RowData>{
    windowSize: {
        height: number,
        width: number
    }
}
export class CustomTableStore<RowData extends Object> {
    constructor(sp: CustomTableStoreProps<RowData>) {
        this.sp = sp
        this.rowsPerPage = (!!sp.pageSizeOptions && sp.pageSizeOptions.length > 0 && sp.pageSizeOptions[0]) || 5
        this.localSize = sp.size
    }
    sp: CustomTableStoreProps<RowData>
    @observable fullscreen = false
    @observable columnSortingIndex = -1
    @observable columnSortingDirection = false as ('asc' | 'desc' | false)
    @observable rowsPerPage: number
    @observable page = 0
    @observable searchString = ""
    @observable headerCellTopValue = undefined as (string | undefined)
    @observable loading = false
    @observable filteredRows = [] as CustomTableLocalRow<RowData>[]
    @observable filteredAndSortedRows = [] as CustomTableLocalRow<RowData>[]
    @observable filteredSortedAndPagedRows = [] as CustomTableLocalRow<RowData>[]
    @observable divMaxHeight = undefined as (number | undefined)
    @observable paginationBoxMinHeight = '64px'
    @observable localRows = [] as CustomTableLocalRow<RowData>[]
    @observable maxCount = 0
    @observable waitingForRowsToCome = false
    @observable localSize?: 'small' | 'medium'
    @computed get size() {
        if (this.sp.userCanToggleSize) {
            return this.localSize
        } else {
            return this.sp.size
        }
    }
    @computed get maxHeight() {
        return (this.fullscreen ? this.sp.windowSize.height - 32 : this.sp.maxHeight) || 0
    }
    @computed get minHeight() {
        return (this.fullscreen ? this.sp.windowSize.height - 32 : this.sp.minHeight) || 0
    }
    @action toggleSize = () => {
        this.loading = true
        setTimeout(() => action(() => {
            this.localSize = (this.localSize === 'small' ? 'medium' : 'small')
            this.loading = false
        })())
    }
    @action setDivMaxHeight = (divMaxHeight: number) => {
        if (divMaxHeight !== this.divMaxHeight) {
            this.divMaxHeight = divMaxHeight
        }
    }
    @action setPaginationBoxMinHeight = (minHeight: string) => {
        if (minHeight !== this.paginationBoxMinHeight && minHeight !== '0px') {
            this.paginationBoxMinHeight = minHeight
        }
    }
    @action setHeaderCellTopValue = (top: string) => {
        if (top !== this.headerCellTopValue && top !== '0px') {
            this.headerCellTopValue = top
        }
    }
    @action toggleFullscreen = () => {
        this.loading = true
        setTimeout(() => action(() => {
            this.fullscreen = !this.fullscreen
            this.loading = false
        })())
    }
    @computed get rows() {
        return this.isRemoteData ? this.localRows : this.filteredSortedAndPagedRows
    }
    getCollapsibleConfig(row: RowData) {
        if (this.sp.collapsibleDetailConfig) {
            return this.sp.collapsibleDetailConfig(row)
        }
    }
    @action setLocalRows = (rows: RowData[]) => {
        const insertWhenDifferent = false
        // when it's remote data, or the localRows are not initialized yet, or the new rows are none, just update straight away
        if (this.isRemoteData || this.localRows.length === 0 || !this.sp.preserveSelectionWhenRowsUpdated || rows.length === 0) {
            this.localRows = rows.map(r => new CustomTableLocalRow(r, undefined, this.getCollapsibleConfig(r)))
            setTimeout(() => this.waitingForRowsToCome = false, 500)
            return
        }

        // max rows between the already existing ones and the new ones
        let max = (this.localRows.length > rows.length ? this.localRows.length : rows.length)
        for (let index = 0; index < max; index++) {
            const source = (index < rows.length ? rows[index] : undefined)
            const target = (index < this.localRows.length ? this.localRows[index] : undefined)

            if (!!source && !target) {
                // if there isn't a target for the new row, just creates it
                this.localRows.push(new CustomTableLocalRow(source, undefined, this.getCollapsibleConfig(source)))
            } else if (!source && !!target) {
                // if there is a target but no source row, delete the target
                this.localRows.splice(index, 1)
                index--
                max--
            } else if (source && target) {
                // if there is source and target
                if (source !== target.row) {
                    // only modifies stuff if the reference of the object is different (like, a different item)
                    if (insertWhenDifferent) {
                        this.localRows.splice(index, 0, new CustomTableLocalRow(source!, undefined, this.getCollapsibleConfig(source!)))
                        max++
                    } else {
                        this.localRows.splice(index, 1, new CustomTableLocalRow(source!, undefined, this.getCollapsibleConfig(source!)))
                    }
                }
            }
        }
        setTimeout(() => this.waitingForRowsToCome = false, 500)
    }
    @computed get hasCollapsibleRowDetail() {
        return !!this.sp.collapsibleDetailConfig
    }
    @computed get isRemoteData() {
        return !!this.sp.remoteDataFetchRequest
    }
    @computed get totalCount() {
        if (this.isRemoteData) {
            return this.sp.totalCount || 0
        } else {
            return this.filteredRows.length || 0
        }
    }
    @computed get hasRefreshButton() {
        if (this.sp.forceHasRefresh !== undefined) {
            return this.sp.forceHasRefresh
        }
        return this.isRemoteData
    }
    @computed get isLoading() {
        if (this.sp.forceIsLoading !== undefined) {
            return this.sp.forceIsLoading
        }
        return this.loading
    }
    set isLoading(value: boolean) {
        if (this.loading !== value) {
            this.loading = value
        }
    }
    @action handleChangePage = (page: number) => {
        this.page = page
        this.dataFetch('page-change')
    }
    @action handleChangeRowsPerPage = (rowsPerPage: number) => {
        this.page = 0
        this.loading = true
        setTimeout(() => {
            this.rowsPerPage = rowsPerPage
            this.dataFetch('page-size-change')
        })
    }
    @action onHeaderCellClick = (index: number) => {
        if (index !== this.columnSortingIndex) {
            this.columnSortingDirection = false
        }
        switch (this.columnSortingDirection) {
            case false:
                this.columnSortingDirection = 'asc'
                this.columnSortingIndex = index
                break;
            case 'asc':
                this.columnSortingDirection = 'desc'
                this.columnSortingIndex = index
                break;
            case 'desc':
                this.columnSortingDirection = false
                this.columnSortingIndex = -1
                break;
        }
        this.dataFetch('sorting-change')
    }
    dataRefresh = async () => {
        this.dataFetch('refresh-button')
    }
    dataRefreshCheckLoading = async () => {
        if (!this.isLoading) {
            this.dataRefresh()
        }
    }
    @action dataFetch = async (reason: DataFetchReason) => {
        this.isLoading = true
        if (this.isRemoteData) {
            this.waitingForRowsToCome = true
        }
        setTimeout(action(async () => {
            if (this.isRemoteData) {
                await this.sp.remoteDataFetchRequest!({
                    page: this.page,
                    pageSize: this.rowsPerPage,
                    searchString: this.searchString,
                    sortDirection: this.columnSortingDirection || undefined,
                    sortField: (this.columnSortingIndex >= 0 ? this.sp.columns[this.columnSortingIndex].field || undefined : undefined),
                })
            } else {
                await this.filterData(reason)
            }
            this.isLoading = false
        }));
    }
    isRowCompliantWithFilter = (row: RowData) => {
        const anyCompliantColumn = !!this.sp.columns.find(c => {
            const rawData = this.getColumnRawData(row, c)
            if (c.columnCustomLocalSearch) {
                c.columnCustomLocalSearch(row, rawData, this.searchString)
            }
            if (rawData !== undefined && rawData !== null) {
                const raw = rawData.toString().toUpperCase()
                if (raw.includes(this.searchString.trim().toUpperCase())) {
                    return true
                } else {
                    return false
                }
            }
            return false
        })

        if (anyCompliantColumn) {
            return true
        } else if (this.sp.customLocalSearch) {
            return this.sp.customLocalSearch(row, this.searchString)
        }

        return false
    }
    getColumnRawData = (row: RowData, column: Column<RowData>, isSorting: boolean = false) => {
        if (typeof (column.searchable) === 'boolean' && !column.searchable) {
            return undefined
        }
        let rawData = undefined as any
        const func = (isSorting ? (column.rawDataForSorting || column.rawDataForSearchingAndSorting) : column.rawDataForSearchingAndSorting)
        if (func) {
            rawData = func(row, column)
        } else if (column.render) {
            const rendered = column.render(row)
            if (typeof (rendered) == 'string' || typeof (rendered) == 'number' || typeof (rendered) == 'bigint' || typeof (rendered) == 'boolean') {
                rawData = rendered
            }
        }
        if ((rawData === undefined || rawData === null) && column.field) {
            rawData = row[column.field]
        }
        return rawData
    }
    sortByColumn = (rows: CustomTableLocalRow<RowData>[], column: Column<RowData>) => {
        const factor = (this.columnSortingDirection === 'asc' ? 1 : -1)
        return rows.slice().sort((a, b) => {
            const aData = this.getColumnRawData(a.row, column, true)
            const bData = this.getColumnRawData(b.row, column, true)
            if (aData < bData) {
                return -1 * factor
            } else if (aData > bData) {
                return 1 * factor
            } else {
                return 0
            }
        })
    }
    applyPagination = (rows: CustomTableLocalRow<RowData>[]) => {
        return rows.slice(this.page! * this.rowsPerPage, (this.page! + 1) * this.rowsPerPage)
    }
    @action filterData = async (reasonParam: DataFetchReason) => {
        let reason = reasonParam
        switch (reason) {
            case "clear-search":
            case "search-change":
            case "initial-mount":
            case 'forced-reload':
            case "data-change":
            case "refresh-button": {
                // filters by search string
                if (!this.searchString) {
                    this.filteredRows = [...this.localRows]
                } else {
                    this.filteredRows = this.localRows.filter(r => this.isRowCompliantWithFilter(r.row))
                }
                const options = this.pageSizeOptionsRender
                if (!options.find(o => o === this.rowsPerPage)) {
                    this.rowsPerPage = options[options.length - 1]
                }
                reason = 'sorting-change'
            }
        }

        switch (reason) {
            case "sorting-change": {
                // order
                if (this.columnSortingIndex >= 0) {
                    this.filteredAndSortedRows = this.sortByColumn(this.filteredRows, this.sp.columns[this.columnSortingIndex])
                } else {
                    this.filteredAndSortedRows = this.filteredRows
                }
                reason = 'page-change'
            }
        }

        switch (reason) {
            case "page-change":
            case "page-size-change": {
                // pagination
                if (this.sp.pagination) {
                    const div = (this.totalCount / this.rowsPerPage)
                    if (this.page >= div) {
                        this.page = (div <= 0 ? 0 : div - 1)
                    }
                    this.filteredSortedAndPagedRows = this.applyPagination(this.filteredAndSortedRows)
                } else {
                    this.filteredSortedAndPagedRows = this.filteredAndSortedRows
                }
            }
        }
    }
    @computed get hasScrolling() {
        return this.sp.maxHeight !== undefined
    }
    @computed get freeActions() {
        if (this.sp.actions && this.sp.actions.freeActions) {
            return this.sp.actions.freeActions
        } else {
            return []
        }
    }
    @computed get rowActions() {
        if (this.sp.actions && this.sp.actions.rowActions) {
            return this.sp.actions.rowActions
        } else {
            return []
        }
    }
    @computed get multipleActions() {
        if (this.sp.actions && this.sp.actions.multipleRowActions) {
            return this.sp.actions.multipleRowActions
        } else {
            return []
        }
    }
    @computed get buttons() {
        let buttons = []
        let index = 0
        if (this.rowsSelectedCount > 0) {
            for (const action of this.multipleActions) {
                let realAction: MultipleRowActionType<RowData> | undefined
                const rows = this.localRows.filter(l => l.selected).map(l => l.row)
                if (typeof (action) === 'function') {
                    realAction = action(rows)
                } else {
                    realAction = action
                }
                if (realAction) {
                    if (realAction.icon) {
                        buttons.push((
                            <CustomTableMultipleRowAction key={index++} title={realAction.title || ""} callback={realAction.callback} icon={realAction.icon} />
                        ))
                    } else {
                        throw new Error('Free actions must have an icon')
                    }
                }
            }
        }
        // for (const action of this.freeActions) {
        //     if (action.icon) {
        //         buttons.push((
        //             <Tooltip title={action.title} key={index++}>
        //                 <IconButton onClick={action.callback} >
        //                     {action.icon()}
        //                 </IconButton>
        //             </Tooltip>
        //         ))
        //     } else {
        //         throw new Error('Free actions must have an icon')
        //     }
        // }
        if (this.hasRefreshButton) {
            buttons.push((
                <React.Fragment key={index++}>
                    {this.isLoading
                        ?
                        <Tooltip title="Loading...">
                            <IconButton>
                                <CircularProgress disableShrink size={24} />
                            </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="Refresh Data" key={index++}>
                            <IconButton onClick={this.dataRefreshCheckLoading} >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </React.Fragment>
            ))
        }
        return buttons
    }
    @computed get headerCellStyle() {
        let style = (this.sp.styling && this.sp.styling.headerStyle && { ...this.sp.styling.headerStyle }) || {}
        style.position = 'sticky'
        style.top = this.headerCellTopValue
        style.zIndex = 1
        style.backgroundColor = 'white'
        return style
    }
    @computed get actionColumnHeaderStyle() {
        let style = this.headerCellStyle || {}
        return style
    }
    @computed get pageSizeOptionsRender() {
        let possiblePageSizes = [...this.sp.pageSizeOptions]

        let options = [] as number[]
        for (let index = 0; index < possiblePageSizes.length; index++) {
            const possiblePageSize = possiblePageSizes[index]

            if (possiblePageSize === this.maxCount) {
                options.push(possiblePageSize)
                break
            } else if (possiblePageSize > this.maxCount) {
                options.push(possiblePageSize)
                break
            } else {
                options.push(possiblePageSize)
            }
        }
        return options
    }
    @action clearSearchString = () => {
        this.searchString = ''
        this.dataFetch('clear-search')
    }
    timeout?: NodeJS.Timeout
    @action onSearchChange = async () => {
        this.isLoading = true
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(async () => {
            this.timeout = undefined
            this.dataFetch('search-change')
        }, (this.sp.searchDebounceInterval || 200))
    }
    @action selectPageAll = () => {
        this.loading = true
        setTimeout(action(() => {
            for (const localRow of this.filteredSortedAndPagedRows) {
                localRow.selected = true
            }
            this.sp.onSelectAll && this.sp.onSelectAll('select-page-all')
            this.loading = false
        }))
    }
    @action selectAll = () => {
        this.loading = true
        setTimeout(action(() => {
            for (const localRow of this.localRows) {
                localRow.selected = true
            }
            this.sp.onSelectAll && this.sp.onSelectAll('select-all')
            this.loading = false
        }))
    }
    @action deselectAll = () => {
        this.loading = true
        setTimeout(action(() => {
            for (const localRow of this.localRows) {
                localRow.selected = false
            }
            this.sp.onSelectAll && this.sp.onSelectAll!('deselect-all')
            this.loading = false
        }))
    }
    @action toggleRowSelection = async (localRow: CustomTableLocalRow<RowData>) => {
        const toggled = !localRow.selected
        if (!this.sp.willToggleRowSelection || await this.sp.willToggleRowSelection(localRow.row, toggled)) {
            localRow.selected = toggled
            this.sp.onRowSelectionToggle && this.sp.onRowSelectionToggle(localRow.row, toggled)
        }
    }
    @computed get rowsSelectedCount() {
        return this.localRows.filter(r => r.selected).length
    }
    @computed get rowsSelectedCountPage() {
        return this.filteredSortedAndPagedRows.filter(r => r.selected).length
    }
    @computed get tableStyle() {
        const style = ((this.sp.styling || {}).style || {}) as React.CSSProperties
        style.borderCollapse = 'separate'
        return style
    }
}

export const CustomTableStoreContext = createContext(new CustomTableStore<Object>({ columns: [], rows: [], windowSize: { width: 0, height: 0} }))

type DataFetchReason = 'page-change' | 'page-size-change' | 'sorting-change' | 'refresh-button' | 'clear-search' | 'search-change' | 'initial-mount' | 'data-change' | 'forced-reload'