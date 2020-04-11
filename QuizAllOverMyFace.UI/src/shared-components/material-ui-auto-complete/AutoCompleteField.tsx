import React, { useRef, useEffect, useLayoutEffect, useMemo } from "react"
import { observer, useLocalStore } from "mobx-react-lite"

import deburr from 'lodash/deburr'
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import MenuItem from "@material-ui/core/MenuItem"
import ClearIcon from '@material-ui/icons/Clear'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Popper from "@material-ui/core/Popper"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import PageviewIcon from "@material-ui/icons/Pageview"
import { makeStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"
import useElementSize from "./useElementSize"
import useElementScroll from "./useElementScroll"
import { AutoCompleteFieldItem } from "./AutoCompleteFieldItem"
import { isRemoteDataSource, isPaginatedResults, hasToScrollUpTo, hasToScrollDownTo, isLocalDataSource } from "./utils"

export default interface AutoCompleteFieldViewLoaderProps {
    onEntityClose: () => any
    entityId?: number
    entityName?: string
    visible: boolean
    readOnly?: boolean
}

export interface AutoCompleteFieldOption {
    id: number | string
    name: string
    description?: string
}

export interface AutoCompleteFieldPaginatedOptions {
    totalCount?: number
    results: AutoCompleteFieldOption[]
}

export type AutoCompleteFieldRemoteOptionsFunction = (lookupProps: { query: string, pageSize?: number, pageNumber?: number }) => Promise<AutoCompleteFieldOption[] | AutoCompleteFieldPaginatedOptions>;
export type LocalLookupData = AutoCompleteFieldOption[];

const useStyles = makeStyles(theme => ({
    popper: {
        zIndex: theme.zIndex.modal + 200,
        marginTop: theme.spacing(1),
    },
    paper: {
        maxHeight: theme.spacing(32),
    }
}))

interface AutoCompleteFieldProps {
    label: string
    placeholder?: string
    value?: any
    initialInputValue?: string
    onChange?: any
    onBlur?: () => any
    dataSource: AutoCompleteFieldRemoteOptionsFunction | LocalLookupData
    disabled?: boolean
    fullWidth?: boolean
    maxResults?: number
    required?: boolean
    error?: boolean
    helperText?: string
    autoFocus?: boolean
    entityView?(props: AutoCompleteFieldViewLoaderProps): React.ReactElement<any>
    pageSize?: number
    debounceInMilliseconds?: number
    maxHeight?: number
}

const uuidv5 = require('uuid/v1')

export const AutoCompleteField = observer((props: AutoCompleteFieldProps) => {
    const timeoutRef = useRef<undefined | NodeJS.Timeout>()
    const inputRef = useRef<HTMLInputElement | undefined>(undefined)
    const paperRef = useRef<HTMLDivElement | undefined>(undefined)
    const selectedRef = useRef<HTMLDivElement | undefined>(undefined)
    const lastPageQuery = useRef("")

    const totalCount = useRef(0)
    const currentPage = useRef(1)

    const uuid = useRef(uuidv5())
    const classes = useStyles()

    const store = useLocalStore(source => ({
        resultsMessage: "",
        formControl: null as HTMLDivElement | null,
        optionsPromise: undefined as Promise<{ options: AutoCompleteFieldOption[], resultsMessage: string, page?: number, newSelectedIndex?: number }> | undefined,
        loading: false,
        options: [] as AutoCompleteFieldOption[],
        optionsVisible: false,
        selectedIndex: 0,
        lookupViewVisible: false,
        inputValue: "",
        onEntityClose: () => {
            store.lookupViewVisible = false
        },
        onInputBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setTimeout(() => {
                if (source.onBlur) {
                    source.onBlur()
                }
                store.clearInputValueWhenSuitable()
            }, 300);
        },
        entityViewClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            store.lookupViewVisible = true
            event.stopPropagation()
        },
        handleClear: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            source.onChange('')
            store.inputValue = ''
            store.showOptions(false)
            store.loading = false
            event.preventDefault()
        },
        handleOpen: () => {
            inputRef.current!.focus()
            store.showOptions()
        },
        hasFocus: () => {
            return !!inputRef.current && inputRef.current === document.activeElement
        },
        fetchOptions: async (getNextPageParam: boolean = false) => {
            let getNextPage = getNextPageParam
            let resultsMessage = ""
            const hasPagination = props.pageSize !== undefined
            const inputValue = deburr(store.inputValue.trim()).toLowerCase()
            const inputLength = inputValue.length
            let count = 0
            let newSelectedIndex = 0
            const max = !!source.maxResults || 999

            let page: number = 1
            if (getNextPage) {
                page = currentPage.current + 1
            }

            let newOptions = [] as AutoCompleteFieldOption[]
            if (isRemoteDataSource(source.dataSource)) {
                try {
                    var results = await source.dataSource({
                        query: store.inputValue,
                        pageNumber: (hasPagination ? page : undefined),
                        pageSize: (hasPagination ? source.pageSize : undefined)
                    })

                    if (isPaginatedResults(results)) {
                        newOptions = results.results
                        totalCount.current = results.totalCount!
                    } else {
                        newOptions = results
                    }
                } catch (error) {
                    newOptions = []
                    resultsMessage = `Error: ${error}`
                }
            } else {
                newOptions = source.dataSource
                    .filter(option => {
                        const keep = count < max && option.name.toUpperCase().includes(inputValue.trim().toUpperCase())

                        if (keep) {
                            count += 1
                        }

                        return keep
                    })
                if (inputLength !== 0) {

                    newOptions = newOptions.sort((a, b) => {
                        const aFirst = (a.name.slice(0, inputLength).toLowerCase() === inputValue)
                        const bFirst = (b.name.slice(0, inputLength).toLowerCase() === inputValue)
                        return (aFirst && bFirst ? 0 : aFirst ? -1 : 1)
                    })
                }
            }

            const options = (getNextPage ? [...store.options, ...newOptions] : newOptions)
            if (getNextPage && options.length > store.options.length) {
                newSelectedIndex = store.options.length
            }

            if (options.length === 0 && !resultsMessage) {
                resultsMessage = "No results"
            }
            return { options, resultsMessage, page, newSelectedIndex }
        },
        resetSelection: () => {
            store.selectedIndex = 0
        },
        handleOptionsFetchRequested: async (getNextPageParam: boolean = false) => {
            let getNextPage = getNextPageParam
            if (getNextPage) {
                if (lastPageQuery.current !== store.inputValue) {
                    getNextPage = false
                }
            }

            lastPageQuery.current = store.inputValue

            if (getNextPage) {
                if (totalCount.current <= store.options.length) {
                    return
                }
            }
            store.loading = true
            store.optionsPromise = undefined
            store.optionsPromise = store.fetchOptions(getNextPage)
            const options = await store.optionsPromise

            // only updates if that promise is still valid
            if (store.loading && !!store.optionsPromise) {
                store.options = options.options
                store.resultsMessage = options.resultsMessage
                currentPage.current = options.page || 1
                if (!getNextPage) {
                    store.resetSelection()
                } else if (options.newSelectedIndex !== undefined) {
                    store.selectedIndex = options.newSelectedIndex
                }
                store.loading = false
            }
            store.optionsPromise = undefined
        },
        onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            store.inputValue = event.target.value
            props.onChange("")
            if (store.inputValue.length > 0) {
                store.showOptions()
            } else {
                store.showOptions(false)
            }
        },
        showOptions(show: boolean = true) {
            store.optionsVisible = show
            if (show) {
                store.debouncedFetch()
            } else {
                store.options = []
                currentPage.current = 1
                store.resultsMessage = ""
            }
        },
        debouncedFetch: async (getNextPage: boolean = false, withDebounce: boolean = true) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
            timeoutRef.current = setTimeout(async () => {
                store.loading = true
                await store.handleOptionsFetchRequested(getNextPage)
                store.loading = false
                timeoutRef.current = undefined
            }, (withDebounce ? source.debounceInMilliseconds || 200 : 0))
        },
        clearInputValueWhenSuitable: () => {
            if (!source.value && !store.hasFocus()) {
                if (!store.loading) {
                    store.inputValue = ""
                    store.showOptions(false)
                }
            }
        },
        selectOption: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>, option: AutoCompleteFieldOption) => {
            source.onChange(option.id)
            store.inputValue = option.name
            store.showOptions(false)
            event.stopPropagation()
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
            switch (event.key) {
                case "Enter":
                    store.selectOption(event, store.options[store.selectedIndex])
                    break;
                case "ArrowDown":
                    if (store.selectedIndex + 1 <= store.options.length - 1) {
                        store.selectedIndex++
                    } else if (props.pageSize !== undefined && store.options.length < totalCount.current) {
                        store.selectedIndex++
                        store.nextPageFetch()
                    }
                    break;
                case "ArrowUp":
                    if (store.selectedIndex - 1 >= 0) {
                        store.selectedIndex--
                    }
                    break;
                case "PageDown":
                    if (!paperRef.current) { break }
                    paperRef.current!.scroll({ top: hasToScrollUpTo(selectedRef.current!, paperRef.current, false) })
                    let nextSibling = selectedRef.current!.nextElementSibling
                    let newNextSelectedIndex = store.selectedIndex
                    while (!!nextSibling) {
                        newNextSelectedIndex++
                        if (hasToScrollDownTo(nextSibling as HTMLElement, paperRef.current) !== undefined) {
                            break
                        }
                        nextSibling = nextSibling.nextElementSibling
                    }
                    if (store.selectedIndex !== newNextSelectedIndex) {
                        store.selectedIndex = newNextSelectedIndex
                        if (store.selectedIndex + 1 > store.options.length - 1) {
                            store.nextPageFetch()
                        }
                    }
                    break;
                case "PageUp":
                    if (!paperRef.current) { break }
                    paperRef.current!.scroll({ top: hasToScrollDownTo(selectedRef.current!, paperRef.current, false) })
                    let prevSibling = selectedRef.current!.previousElementSibling
                    let newPrevSelectedIndex = store.selectedIndex
                    while (!!prevSibling) {
                        newPrevSelectedIndex--
                        if (hasToScrollUpTo(prevSibling as HTMLElement, paperRef.current) !== undefined) {
                            break
                        }
                        prevSibling = prevSibling.previousElementSibling
                    }
                    if (store.selectedIndex !== newPrevSelectedIndex) {
                        store.selectedIndex = newPrevSelectedIndex
                    }
                    break;
            }
        },
        setFormControl: (instance: HTMLDivElement | null) => store.formControl = instance,
        nextPageFetch: (event?: React.MouseEvent<HTMLLIElement>) => {
            store.debouncedFetch(true, false)
            if (event) {
                event.stopPropagation()
                inputRef.current!.focus()
            }
        }
    }), props)

    const formControlSize = useElementSize(store.formControl)
    const scrollInfo = useElementScroll(paperRef.current)

    useEffect(() => {
        if (!!props.initialInputValue) {
            store.inputValue = props.initialInputValue
        } else {
            store.inputValue = ""
        }
    }, [props.initialInputValue, store])

    useEffect(() => {
        if (!props.initialInputValue) {
            if (props.value && isLocalDataSource(props.dataSource)) {
                const val = props.dataSource.find(item => item.id === props.value)
                store.inputValue = (val ? val.name : "")
            }
        }

    }, [props.initialInputValue, props.dataSource, store.inputValue, props.value])

    useEffect(() => {
        store.clearInputValueWhenSuitable()
    }, [props.value, store])

    useLayoutEffect(() => {
        const paper = paperRef.current
        const selectedElement = selectedRef.current
        if (selectedElement && paper) {
            const topUp = hasToScrollUpTo(selectedElement, paper)
            if (topUp !== undefined) {
                paper.scroll({ top: topUp })
            }
            const topDown = hasToScrollDownTo(selectedElement, paper)
            if (topDown !== undefined) {
                paper.scroll({ top: topDown })
            }
        }
    }, [store.selectedIndex, store.options])

    useEffect(() => {
        if (props.pageSize !== undefined && (scrollInfo.reachedBottom)) {
            store.nextPageFetch()
        }
    }, [scrollInfo.reachedBottom, props.pageSize, store])

    const popper = useMemo(() => {
        
        let paperStyle: React.CSSProperties = {
            width: formControlSize.width,
            overflow: 'auto'
        }

        if (props.maxHeight !== undefined) {
            paperStyle.maxHeight = props.maxHeight
        }

        return (
            < Popper
                className={classes.popper}
                anchorEl={store.formControl}
                placement='bottom-end'
                open={store.optionsVisible}
                style={{ width: formControlSize.width }}
            >
                <Paper
                    square
                    className={classes.paper}
                    ref={paperRef}
                    style={paperStyle}>
                    {store.options.map((option, index) =>
                        <AutoCompleteFieldItem
                            key={index}
                            selectedIndex={store.selectedIndex}
                            index={index}
                            option={option}
                            inputValue={store.inputValue}
                            onClick={store.selectOption}
                            selectedRef={selectedRef}
                        />)}
                    {props.pageSize !== undefined && store.options.length < totalCount.current && (store.options.length > 0 || store.loading) && (
                        <MenuItem onClick={store.loading ? undefined : store.nextPageFetch}><i>{store.loading ? "Loading..." : "Load more..."}</i></MenuItem>
                    )}
                    {store.resultsMessage && (
                        <MenuItem><i>{store.resultsMessage}</i></MenuItem>
                    )}
                </Paper>
            </Popper >
        )
    }, [store.nextPageFetch, props.pageSize, store.loading, props.maxHeight, store.formControl, store.resultsMessage, formControlSize.width,
        classes.popper, classes.paper, store.inputValue, store.options, store.optionsVisible, store.selectOption, store.selectedIndex])

    return (
        <>
            <FormControl ref={store.setFormControl} fullWidth={props.fullWidth} >
                <InputLabel disabled={props.disabled} required={props.required} disableAnimation={false} htmlFor={"autocomplete-textfield" + uuid}>{props.label}</InputLabel>
                <Input
                    onKeyDown={store.onKeyDown}
                    value={store.inputValue}
                    disabled={props.disabled}
                    onChange={store.onInputChange}
                    onBlur={store.onInputBlur}
                    inputRef={inputRef}
                    id={"autocomplete-textfield" + uuid}
                    startAdornment={!!props.entityView && !!props.value && (
                        <IconButton onClick={store.entityViewClick} size="small">
                            <PageviewIcon />
                        </IconButton>
                    )}
                    endAdornment={

                        <InputAdornment position="end">
                            {store.loading && (
                                <CircularProgress size={24} />
                            )}
                            {!props.disabled && (
                                (props.value || store.inputValue || store.optionsVisible)
                                    ?
                                    <IconButton aria-label="clear" onClick={store.handleClear}>
                                        <ClearIcon />
                                    </IconButton>
                                    :
                                    <IconButton aria-label="clear" onClick={store.handleOpen}>
                                        <ArrowDropDownIcon />
                                    </IconButton>
                            )}
                        </InputAdornment>
                    }
                />
                {(props.helperText ? <FormHelperText error={props.error}>{props.helperText}</FormHelperText> : null)}
            </FormControl>
            {!!store.lookupViewVisible && !!props.entityView && !!props.value &&
                props.entityView({ onEntityClose: store.onEntityClose, entityId: props.value, entityName: store.inputValue, readOnly: true, visible: true })
            }
            {popper}
        </>
    )
})
