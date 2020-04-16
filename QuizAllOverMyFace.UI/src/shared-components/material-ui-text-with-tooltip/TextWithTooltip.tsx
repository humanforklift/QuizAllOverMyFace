import React from "react"
import { observer } from "mobx-react-lite"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"

interface TextWithTooltipProps {
    text: string
    // variant?: any//ThemeStyle
    tooltip: React.ReactNode | string
}

export const TextWithTooltip = observer(({tooltip, text/*, variant = 'body2'*/}: TextWithTooltipProps) => {
    return (
        <Tooltip title={tooltip!.toString()}>
            <Typography /*variant={variant}*/>
                {text}
            </Typography>
        </Tooltip>
    )
})