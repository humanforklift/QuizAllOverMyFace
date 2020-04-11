import React, { useRef } from 'react'
import { useObserver, useLocalStore } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import Box from '@material-ui/core/Box'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import clsx from 'clsx'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import useElementSize from '../../hooks/useElementSize'
import { action } from 'mobx'

interface CustomTablePaginationProps {
    paginationDivRef: React.RefObject<HTMLDivElement>
}


const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    /* Styles applied to the Select component `select` class. */
    select: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(3),
        textAlign: 'right',
        textAlignLast: 'right', // Align <select> on Chrome.
    },
    rowsLabel: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        textAlign: 'right',
        textAlignLast: 'right', // Align <select> on Chrome.
    },
    /* Styles applied to the Select component `icon` class. */
    selectIcon: {
        //top: 1,
    },
    /* Styles applied to the Select component root element. */
    selectRoot: {
        // `.selectRoot` should be merged with `.input` in v5.
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(4),
    },
    /* Styles applied to the `InputBase` component. */
    input: {
        color: 'inherit',
        fontSize: 'inherit',
        flexShrink: 0,
    },
    /* Styles applied to the caption Typography components if `variant="caption"`. */
    caption: {
        flexShrink: 0,
    },
    slider: {
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    //toolbar: { maxHeight: theme.spacing(8), minHeight: theme.spacing(7), paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) },
    toolbar: { minHeight: theme.spacing(7), paddingLeft: theme.spacing(1), paddingRight: theme.spacing(1) },
}))

export const CustomTablePagination = <RowData extends Object>(props: CustomTablePaginationProps) => {
    const classes = useStyles()
    const theme = useTheme()
    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)
    const boxRef = useRef<HTMLDivElement | null>(null)
    const pagDivSize = useElementSize(boxRef.current)

    const store = useLocalStore(sp => ({
        pageLabelOn: false,
        temporaryPage: (undefined as number | undefined),
        handlePageSliderChange(event: any, page: number | number[]) {
            store.temporaryPage = undefined
            const newPage = (page as number) - 1
            if (newPage !== rootStore.page) {
                rootStore.handleChangePage(newPage)
            }

        },
        handlePageSliderTemporaryChange(event: any, page: number | number[]) {
            store.temporaryPage = (page as number) - 1
        },
        handlePageChange(event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>) {
            rootStore.handleChangePage(event.target.value as number)
            store.setPageLabelOn()
        },
        handleRowsPerPageChange(event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>) {
            rootStore.handleChangeRowsPerPage(event.target.value as number)
        },
        timeoutControl: undefined as (NodeJS.Timeout | undefined),
        setPageLabelOn() {
            store.pageLabelOn = true
            if (store.timeoutControl !== undefined) {
                clearTimeout(store.timeoutControl)
            }
            store.timeoutControl = setTimeout(action(() => {
                store.timeoutControl = undefined
                store.pageLabelOn = false
            }), 700);
        },
        handleFirstPageButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
            store.setPageLabelOn()
            rootStore.handleChangePage(0)
        },
        handleBackButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
            rootStore.handleChangePage(rootStore.page - 1)
            store.setPageLabelOn()
        },
        handleNextButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
            rootStore.handleChangePage(rootStore.page + 1)
            store.setPageLabelOn()
        },
        handleLastPageButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
            rootStore.handleChangePage(store.lastPage)
            store.setPageLabelOn()
        },
        get paginationBoxMinHeight() {
            return rootStore.paginationBoxMinHeight
        },
        get lastPage() {
            return Math.max(0, Math.ceil(rootStore.totalCount / rootStore.rowsPerPage) - 1)
        },
        get paginationControlsEnabled() {
            return store.pages.length > 1
        },
        get pages() {
            return generateNumbersArray(store.lastPage, 0)
        },
        get pagesRendered() {
            return store.pages.map(page => (<MenuItem key={page} value={page}> {page + 1} </MenuItem>))
        },
        get paginationLabel() {
            const from = rootStore.totalCount === 0 ? 0 : rootStore.page * rootStore.rowsPerPage + 1
            const to = Math.min(rootStore.totalCount, (rootStore.page + 1) * rootStore.rowsPerPage)
            const selected = rootStore.rowsSelectedCount
            return `${from}-${to === -1 ? rootStore.totalCount : to} of ${rootStore.totalCount}` + (selected ? ` (${selected} selected)` : "")
        },
        get completeSet() {
            return (sp.pagDivSize.width > 400)
        },
    }), { pagDivSize, ...props })

    return useObserver(() => (!rootStore.sp.pagination ? null :
        <div
            ref={boxRef}
            style={{
                minHeight: store.paginationBoxMinHeight,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderTop: '1px solid rgba(224, 224, 224, 1)',
            }}
        >
            <div
                ref={props.paginationDivRef}
                style={{ bottom: '0px', right: '0px', position: 'absolute' }}
            >
                <Toolbar className={classes.toolbar} >
                    <Select
                        classes={{
                            select: classes.select,
                            icon: classes.selectIcon,
                        }}
                        input={<InputBase className={clsx(classes.input, classes.selectRoot)} />}
                        value={rootStore.rowsPerPage}
                        onChange={store.handleRowsPerPageChange}
                        renderValue={(value) => <Typography variant="body2">
                            {(value as number) + " rows / page"}
                        </Typography>}
                    >
                        {rootStore.pageSizeOptionsRender.map(rowsPerPage => (
                            <MenuItem key={rowsPerPage} value={rowsPerPage}> {rowsPerPage} </MenuItem>
                        ))}
                    </Select>
                    {store.completeSet && (
                        <Tooltip title='Rows being displayed'>
                            <Typography variant="body2" className={classes.rowsLabel} style={{ whiteSpace: 'nowrap' }}>
                                {store.paginationLabel}
                            </Typography>
                        </Tooltip>
                    )}
                    <>
                        <Tooltip title='Previous Page'>
                            <span>
                                <IconButton
                                    onClick={store.handleBackButtonClick}
                                    disabled={!store.paginationControlsEnabled || rootStore.page === 0}
                                    aria-label="previous page">
                                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                </IconButton>
                            </span>
                        </Tooltip>
                        {store.completeSet && (
                            <Box width={80} className={classes.slider}>
                                <Slider
                                    disabled={!store.paginationControlsEnabled}
                                    min={1}
                                    max={store.lastPage + 1}
                                    onChangeCommitted={store.handlePageSliderChange}
                                    onChange={store.handlePageSliderTemporaryChange}
                                    value={store.temporaryPage !== undefined ? store.temporaryPage + 1 : rootStore.page + 1}
                                    valueLabelDisplay={store.pageLabelOn ? "on" : "auto"}
                                    track={false}
                                />
                            </Box>
                        )}

                        <Tooltip title='Next Page'>
                            <span>
                                <IconButton
                                    onClick={store.handleNextButtonClick}
                                    disabled={!store.paginationControlsEnabled || rootStore.page >= store.lastPage}
                                    aria-label="next page"
                                >
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </>
                </Toolbar>
            </div>
        </div >
    ))
}

function generateNumbersArray(topNumber: number, starting: number = 1) {
    return Array.from(Array(topNumber - starting + 1).keys()).map(item => item + starting)
}