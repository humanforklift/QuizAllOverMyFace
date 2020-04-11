import React, { useRef, useCallback, useMemo, useLayoutEffect } from "react"
import { useObserver } from "mobx-react-lite"
import MaterialTable, { MaterialTableProps, Icons } from "material-table"
import { forwardRef } from 'react'

import AddBox from '@material-ui/icons/AddBox'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import Paper from "@material-ui/core/Paper"

const tableIcons: Icons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

interface MaterialTableAdditionalProps {
    /**
     * define a max height for the table. That will cause the header to be sticky to the top when scrolling down.
     * This is not compatible if you are redefining props.compoments.Container - passing a maxHeight will redefine
     * the Container.
     */
    maxHeight?: number
}

export function TableComponent<RowData extends object>(props: MaterialTableProps<RowData> & MaterialTableAdditionalProps) {
    let { components, maxHeight, ...newProps } = props
    const paperRef = useRef<HTMLDivElement>(null)

    const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        const paper = paperRef.current!
        const thead = paper.getElementsByTagName('thead')[0]
        const headerElements = paper.getElementsByTagName('th')
        const toolbar = paper.getElementsByClassName('MuiToolbar-root')[0] as HTMLDivElement
        const paperTop = paper.getBoundingClientRect().top
        const headerTop = thead.getBoundingClientRect().top

        toolbar.style.backgroundColor = 'white'
        toolbar.style.position = 'sticky'
        toolbar.style.top = '0px'

        if (!toolbar.style.zIndex) {
            toolbar.style.zIndex = '1'
        }

        for (const header of headerElements) {
            header.style.top = (paperTop - headerTop + toolbar.offsetHeight) + 'px'
            header.style.border = '1px black'
        }
    }, [])

    useLayoutEffect(() => {
        if (paperRef.current) {
            const paper = paperRef.current
            const toolbar = paper.getElementsByClassName('MuiToolbar-root')[0] as HTMLDivElement
            toolbar.style.backgroundColor = 'white'
        }
    })

    const newComponents = useMemo(() => {
        const newRet = components || {}
        if (!!maxHeight) {
            if (!!newRet.Container) {
                throw new Error("Can't pass both maxHeight and components.Container props, their are not compatible, as maxHeight causes components.Container to be redefined to a Paper.")
            }
            newRet.Container = props => (
                <Paper {...props} ref={paperRef} onScroll={onScroll} style={{ maxHeight, overflow: 'auto' }} />
            )
        }
        return newRet
    }, [components, maxHeight, onScroll])

    return useObserver(() => (
        <MaterialTable<RowData> {...newProps} components={newComponents} icons={tableIcons} />
    ))
}