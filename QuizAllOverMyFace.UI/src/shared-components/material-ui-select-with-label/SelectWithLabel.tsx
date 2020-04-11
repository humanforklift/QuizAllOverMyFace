import React from "react"
import { observer, useLocalStore } from "mobx-react-lite"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import PageviewIcon from "@material-ui/icons/Pageview"

import ViewLoaderProps from "../interfaces/ViewLoaderProps"

const uuidv5 = require('uuid/v1')

export interface SelectWithLabelProps {
    label: string
    onChange?: (
        event: React.ChangeEvent<{ name?: string; value: unknown }>,
        child: React.ReactNode,
    ) => void
    value?: any
    lookups?: { id: number | string, name?: string, description?: string }[]
    disabled?: boolean
    fullWidth?: boolean
    required?: boolean
    error?: boolean
    helperText?: string
    autoFocus?: boolean
    lookupView?(props: ViewLoaderProps): React.ReactElement<any>
    variant?: 'standard' | 'outlined' | 'filled'
}

export const SelectWithLabel = observer((props: SelectWithLabelProps) => {
    const store = useLocalStore(source => ({
        uuid: uuidv5(),
        lookupViewVisible: false,
        entityId: 0,
        entityName: "",
        onEntityClose() {
            store.lookupViewVisible = false
        },
        onLookupViewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            store.entityId = source.value
            store.entityName = ""
            store.lookupViewVisible = true
            event.stopPropagation()
        },
    }), props)

    return (
        <>
            <FormControl fullWidth={props.fullWidth} error={props.error} >
                <InputLabel disabled={props.disabled} required={props.required} htmlFor={store.uuid}>{props.label}</InputLabel>

                <Select style={{ width: '100%' }}
                    variant={props.variant}
                    required={props.required}
                    inputProps={{ id: store.uuid, style: { width: '100%' } }}
                    onChange={props.onChange}
                    value={props.value}
                    disabled={props.disabled}
                    fullWidth={props.fullWidth}
                    autoFocus={props.autoFocus}
                    startAdornment={!!props.lookupView && !!props.value && (
                        <IconButton onClick={store.onLookupViewClick} size="small">
                            <PageviewIcon />
                        </IconButton>
                    )}
                >

                    {!!props.lookups && props.lookups.map(d => (
                        <MenuItem value={d.id} key={d.id} title={d.description}>
                            <Typography variant="inherit">{d.name || d.id}</Typography>
                        </MenuItem>
                    ))}
                </Select>
                {(props.helperText ? <FormHelperText error={props.error}>{props.helperText}</FormHelperText> : null)}

            </FormControl>
            {!!store.lookupViewVisible && !!props.lookupView && !!store.entityId &&
                props.lookupView({ onEntityClose: store.onEntityClose, entityId: store.entityId, entityName: store.entityName, readOnly: true, visible: true })
            }
        </>
    )
})