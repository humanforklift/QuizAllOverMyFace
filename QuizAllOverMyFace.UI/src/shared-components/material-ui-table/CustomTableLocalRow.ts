import { CustomTableCollapsibleDetailConfig } from "./CustomTable"
import { observable } from "mobx"

export class CustomTableLocalRow<RowData extends Object> {
    constructor(row: RowData, selected: boolean = false, collapsibleConfig: CustomTableCollapsibleDetailConfig = {}) {
        this.row = row
        this.selected = selected
        this.collapsibleConfig = collapsibleConfig
        if (collapsibleConfig.rowHasCollapsibleDetail) {
            this.collapsibleOpen = (collapsibleConfig.rowStartsOpened !== undefined ? collapsibleConfig.rowStartsOpened : false)
        }
    }
    row: RowData
    @observable selected: boolean
    @observable collapsibleOpen?: boolean
    collapsibleConfig: CustomTableCollapsibleDetailConfig
}