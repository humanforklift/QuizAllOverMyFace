import { makeStyles } from '@material-ui/core/styles'
export const useStylesRowOpenedNoBorder = makeStyles(theme => ({
    cellClosed: {

    },
    cellOpened: {
        borderBottom: '0px',
        borderCollapse: 'separate',
    },
}))

export const useStylesRowClosedNoBorder = makeStyles(theme => ({
    cellClosed: {
        borderBottom: '0px',
        borderCollapse: 'separate',
    },
    cellOpened: {
    },
}))