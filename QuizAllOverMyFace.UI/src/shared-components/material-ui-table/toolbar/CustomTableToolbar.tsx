import React from 'react'
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import { useObserver } from "mobx-react-lite"
import { useContext } from "react"
import { CustomTableStoreContext, CustomTableStore } from "../CustomTableStore"
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip'
import { InputProps } from '../../input-props'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess'

interface CustomTableToolbarProps<RowData extends Object> {
    componentHeaderRef: React.RefObject<HTMLDivElement>
}

export const CustomTableToolbar = <RowData extends Object>(props: CustomTableToolbarProps<RowData>) => {
    const rootStore = useContext<CustomTableStore<RowData>>(CustomTableStoreContext as any)
    const styling = rootStore.sp.styling || {}

    return useObserver(() => (
        <div ref={props.componentHeaderRef} style={{ position: 'sticky', top: '0px', zIndex: 1, backgroundColor: 'white' }}>
            <Toolbar >
                {typeof (rootStore.sp.title) === 'string'
                    ?
                    <Typography variant='h6' color='secondary'>
                        {rootStore.sp.title}
                    </Typography>
                    :
                    rootStore.sp.title
                }
                <Box style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={rootStore.isLoading && !rootStore.hasRefreshButton ? "Loading..." : ""} style={{ visibility: (rootStore.isLoading && !rootStore.hasRefreshButton ? "visible" : "hidden") }} >
                        <IconButton style={{ visibility: (rootStore.isLoading && !rootStore.hasRefreshButton ? "visible" : "hidden") }}>
                            <CircularProgress disableShrink size={24} style={{ visibility: (rootStore.isLoading && !rootStore.hasRefreshButton ? "visible" : "hidden") }} />
                        </IconButton>
                    </Tooltip>

                    <InputProps stateObject={rootStore} propertyName={'searchString'} onValueChange={rootStore.onSearchChange} >
                        <Input
                            style={styling.searchFieldStyle}
                            inputProps={{ style: styling.searchFieldInputStyle }}
                            id='table-search'
                            startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton disabled={!rootStore.searchString} aria-label="clear" onClick={rootStore.clearSearchString}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </InputProps>
                    {rootStore.sp.fullscreenable && (
                        <Tooltip title="Toggle fullscreen" >
                            <IconButton onClick={rootStore.toggleFullscreen}>
                                {(rootStore.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />)}
                            </IconButton>
                        </Tooltip>
                    )}
                    {rootStore.sp.userCanToggleSize && (
                        <Tooltip title="Toggle table density" >
                            <IconButton onClick={rootStore.toggleSize}>
                                {(rootStore.size === 'small' ? <UnfoldMoreIcon /> : <UnfoldLessIcon />)}
                            </IconButton>
                        </Tooltip>
                    )}
                    {rootStore.buttons}
                </Box>
            </Toolbar>
            {rootStore.sp.renderBetweenToolbarAndTable}
        </div>
    ))
}