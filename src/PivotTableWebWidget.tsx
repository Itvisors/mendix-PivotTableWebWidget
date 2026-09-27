import { Component, ReactNode, SyntheticEvent } from "react";
import { PivotTableWebWidgetContainerProps } from "../typings/PivotTableWebWidgetProps";
import { ObjectItem, ValueStatus } from "mendix";
import { ErrorArray, ModelCellValue, TableCellData, TableData, TableRowData, ValueDataType } from "./types/CustomTypes";
import ExcelJS from "exceljs";
import { formatValue } from "mendix/parser";

import "./ui/PivotTableWebWidget.css";
import Data from "./classes/Data";

export default class PivotTableWebWidget extends Component<PivotTableWebWidgetContainerProps> {
    private CLASS_WIDGET = "pivotTableWidget";
    private CLASS_CELL_CLICKABLE = "clickable";
    private CLASS_CONFIG_ERRORS = "configurationErrors";
    private CLASS_NO_DATA = "noDataAvailable";
    private previousDataChangeDate?: Date = undefined;
    private previousDataSourceItemArray?: ObjectItem[] = undefined;
    private tableData?: TableData = undefined;
    private valueDataType: ValueDataType = "number";
    private errorArray?: ErrorArray;

    constructor(props: PivotTableWebWidgetContainerProps) {
        super(props);
        this.errorArray = [];
        this.state = {
            lastStateUpdate: undefined
        };
        this.onClick = this.onClick.bind(this);
        this.onClickExportButton = this.onClickExportButton.bind(this);
    }

    render(): ReactNode {
        const { dataSourceType, ds, serviceUrl } = this.props;

        if (this.errorArray && this.errorArray.length > 0) {
            return this.renderErrors();
        }

        // If something is not (yet) available, render what we got from a previous render.
        switch (dataSourceType) {
            case "datasource":
                // Do not check for ds status here. If it is loading, we render current data, if any, this prevents flickering.
                if (!ds?.items) {
                    if (this.props.logToConsole) {
                        this.logMessageToConsole("render: ds not yet available");
                    }
                    return this.renderTable();
                }
                break;

            case "serviceCall":
                if (serviceUrl?.status !== ValueStatus.Available) {
                    if (this.props.logToConsole) {
                        this.logMessageToConsole("render: service URL not yet available");
                    }
                    return this.renderTable();
                }
                break;

            default:
                return this.renderTable();
        }

        if (this.props.logToConsole) {
            this.logMessageToConsole("render");
        }

        this.getData();

        return this.renderTable();
    }

    private renderErrors(): ReactNode {
        if (this.props.logToConsole) {
            this.logMessageToConsole("renderErrors");
        }

        const className = this.CLASS_WIDGET + " " + this.CLASS_CONFIG_ERRORS + " " + this.props.class;
        return (
            <div className={className}>
                <h3>Pivot table widget {this.props.name} has configuration errors</h3>
                <ul>
                    {this.errorArray &&
                        this.errorArray.map((item: string, index) => {
                            return <li key={index}>{item}</li>;
                        })}
                </ul>
            </div>
        );
    }

    private renderTable(): ReactNode {
        if (this.props.logToConsole) {
            this.logMessageToConsole("renderTable");
        }

        const className = this.CLASS_WIDGET + " " + this.props.class;
        if (this.tableData) {
            if (this.tableData.bodyRows.length > 0) {
                return (
                    <div className={className}>
                        <table>
                            <thead>
                                <tr>{this.tableData.headerRow.cells.map(cell => this.renderCell(cell))}</tr>
                            </thead>
                            <tbody>{this.tableData.bodyRows.map(row => this.renderTableRow(row))}</tbody>
                            {this.renderTableFooter()}
                        </table>
                    </div>
                );
            } else {
                return (
                    <div className={className}>
                        <span className={this.CLASS_NO_DATA}>{this.props.noDataText.value}</span>
                    </div>
                );
            }
        } else {
            return <div className={className}></div>;
        }
    }

    private renderTableRow(rowData: TableRowData): ReactNode {
        const rowKey = "tr_" + rowData.cells[0].idValueY;
        return <tr key={rowKey}>{rowData.cells.map(item => this.renderCell(item))}</tr>;
    }

    private renderTableFooter(): ReactNode {
        if (!this.props.showTotalRow || !this.tableData?.footerRow) {
            return null;
        }
        const { footerRow } = this.tableData;
        return (
            <tfoot>
                <tr>{footerRow.cells.map(item => this.renderCell(item))}</tr>
            </tfoot>
        );
    }

    private renderCell(cell: TableCellData): ReactNode {
        switch (cell.cellType) {
            case "ColumnHeader":
                const colKey = "x_" + cell.idValueX;
                return (
                    <th key={colKey} className={cell.classes}>
                        <div>
                            <span>{cell.cellValue}</span>
                        </div>
                    </th>
                );
            case "RowHeader":
                const rowKey = "y_" + cell.idValueY;
                return (
                    <th key={rowKey} className={cell.classes}>
                        <span>{cell.cellValue}</span>
                    </th>
                );

            case "EmptyTopLeft":
                return <th key="TL" className={cell.classes} />;

            case "ExportButton":
                return (
                    <th key="TL_Export" className={cell.classes}>
                        <div>{this.renderExportButton()}</div>
                    </th>
                );

            case "ColumnTotal":
                const colTotalKey = "tx_" + cell.idValueX;
                return (
                    <td key={colTotalKey} className={cell.classes}>
                        <span>{cell.cellValue}</span>
                    </td>
                );

            case "RowTotal":
                const rowTotalKey = "ty_" + cell.idValueY;
                return (
                    <td key={rowTotalKey} className={cell.classes}>
                        <span>{cell.cellValue}</span>
                    </td>
                );

            case "RowColumnTotal":
                return (
                    <td key="txy" className={cell.classes}>
                        {cell.cellValue}
                    </td>
                );

            default:
                const cellKey = "c_" + cell.idValueY + cell.idValueX;
                return (
                    <td key={cellKey} className={this.getCellClasses(cell)} onClick={e => this.onClick(e, cell)}>
                        {cell.cellValue}
                    </td>
                );
        }
    }

    onClick(e: SyntheticEvent, cell: TableCellData): void {
        if (this.props.logToConsole) {
            this.logMessageToConsole("onClick: Handle click on X: " + cell.idValueX + ", Y: " + cell.idValueY);
        }

        const { onClickAction } = this.props;
        e.preventDefault();

        if (onClickAction && onClickAction.canExecute && !onClickAction.isExecuting) {
            const idValueX = cell.idValueX ? cell.idValueX : "";
            const idValueY = cell.idValueY ? cell.idValueY : "";
            onClickAction.execute({
                onClickX: idValueX,
                onClickY: idValueY
            });
        }
    }

    private renderExportButton(): ReactNode {
        const { exportButtonCaption, exportButtonClass } = this.props;
        const className = "btn mx-button " + exportButtonClass;
        return (
            <button className={className} onClick={this.onClickExportButton}>
                {exportButtonCaption.value}
            </button>
        );
    }

    async onClickExportButton(): Promise<void> {
        if (this.props.logToConsole) {
            this.logMessageToConsole("onClickExportButton called");
        }

        if (!this.tableData) {
            if (this.props.logToConsole) {
                this.logMessageToConsole("onClickExportButton: No table data");
            }
            return;
        }

        let url;

        switch (this.props.exportType) {
            case "csv":
                url = this.exportToCSV(this.tableData);
                break;

            case "xlsx":
                url = await this.exportToExcel(this.tableData);
                break;

            default:
                break;
        }

        if (url) {
            const { exportFilenamePrefix, exportFilenameDateformat } = this.props;
            const dateFormat = exportFilenameDateformat?.value ? exportFilenameDateformat.value : "dd-MM-yyyy HH:mm:ss";
            const dateString = formatValue(new Date(), "DateTime", { datePattern: dateFormat });
            const fileName = exportFilenamePrefix + " " + dateString + "." + this.props.exportType;
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // Cleanup temporary element
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    private exportToCSV(tableData: TableData): string {
        const { headerRow, bodyRows, footerRow } = tableData;

        let exportData = "";

        // Header
        exportData += this.exportRowValuesToCSV(headerRow);

        // Body
        for (const row of bodyRows) {
            exportData += this.exportRowValuesToCSV(row);
        }

        // Footer
        if (this.props.showTotalRow && footerRow) {
            exportData += this.exportRowValuesToCSV(footerRow);
        }

        const blob = new Blob([exportData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        return url;
    }

    private exportRowValuesToCSV(row: TableRowData): string {
        let result = "";
        let firstCell = true;
        for (const cell of row.cells) {
            if (firstCell) {
                result = this.exportCellValueForCSV(cell);
                firstCell = false;
            } else {
                result += ";" + this.exportCellValueForCSV(cell);
            }
        }
        result += "\r\n";
        return result;
    }

    private exportCellValueForCSV(cell: TableCellData): string {
        switch (cell.cellType) {
            case "EmptyTopLeft":
            case "ExportButton":
                return "";

            case "ColumnHeader":
            case "RowHeader":
                const labelValue = cell.cellValue ? cell.cellValue : "";
                return '"' + labelValue + '"';

            default:
                const cellValue = cell.cellValue ? cell.cellValue : "";
                if (this.valueDataType === "string") {
                    return '"' + cellValue + '"';
                } else {
                    return cellValue;
                }
        }
    }

    private async exportToExcel(tableData: TableData): Promise<string> {
        if (this.props.logToConsole) {
            this.logMessageToConsole("exportToExcel");
        }

        const { headerRow, bodyRows, footerRow } = tableData;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Export");

        // Header
        this.addExcelRow(worksheet, headerRow);

        // Body
        for (const row of bodyRows) {
            this.addExcelRow(worksheet, row);
        }

        // Footer
        if (this.props.showTotalRow && footerRow) {
            this.addExcelRow(worksheet, footerRow);
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        return URL.createObjectURL(blob);
    }

    private addExcelRow(worksheet: ExcelJS.Worksheet, row: TableRowData): void {
        // Styling (bold, font color, background color) volgt later.
        const rowValues = row.cells.map(cell => this.getExcelCellValue(cell));
        worksheet.addRow(rowValues);
    }

    private getExcelCellValue(cell: TableCellData): string | number | Date | undefined {
        switch (cell.cellType) {
            // Always empty in Excel
            case "EmptyTopLeft":
            case "ExportButton":
            case "Empty":
                return undefined;

            // Labels are always text, rawCellValue not used here.
            case "ColumnHeader":
            case "RowHeader":
                return cell.cellValue ? cell.cellValue : undefined;

            // Use the typed raw value if available, fallback on formatted cell value.
            case "Value":
            case "RowTotal":
            case "ColumnTotal":
            case "RowColumnTotal":
                if (cell.rawCellValue !== undefined) {
                    return this.convertRawCellValue(cell.rawCellValue);
                }
                return cell.cellValue ? cell.cellValue : undefined;

            default:
                return cell.cellValue ? cell.cellValue : undefined;
        }
    }

    private convertRawCellValue(rawCellValue: ModelCellValue): string | number | Date {
        switch (this.valueDataType) {
            case "date":
                return new Date(Number(rawCellValue));

            case "number":
                return Number(rawCellValue);

            default:
                return rawCellValue;
        }
    }

    private getCellClasses(cell: TableCellData): string {
        const classArray = [cell.classes];

        if (this.props.onClickAction) {
            classArray.push(this.CLASS_CELL_CLICKABLE);
        }

        // The join function will skip null values, easier than dealing with that in the code.
        return classArray.join(" ");
    }

    private getData(): void {
        const { dataSourceType } = this.props;
        if (this.props.logToConsole) {
            this.logMessageToConsole("getData");
        }

        // Load the data
        switch (dataSourceType) {
            case "datasource":
                this.getDataFromDatasource();
                break;

            case "serviceCall":
                this.getDataFromService();
                break;
        }
        if (this.props.logToConsole) {
            this.logMessageToConsole("getData end");
        }
    }

    private getDataFromDatasource(): void {
        if (this.props.logToConsole) {
            this.logMessageToConsole("getDataFromDatasource");
        }

        const { ds } = this.props;
        if (this.previousDataSourceItemArray && ds?.items === this.previousDataSourceItemArray) {
            if (this.props.logToConsole) {
                this.logMessageToConsole("getDataFromDatasource: Datasource data still the same");
            }
            return;
        }

        this.logMessageToConsole("getDataFromDatasource: Datasource data changed");
        this.previousDataSourceItemArray = ds?.items;

        const data = new Data();
        data.getDataFromDatasource(this.props);

        const { modelData } = data;
        if (modelData.errorArray && modelData.errorArray.length > 0) {
            this.errorArray = modelData.errorArray;
            this.tableData = undefined;
            if (this.props.logToConsole) {
                this.logMessageToConsole("getDataFromDatasource: Error(s) occurred while getting the data, change the state to force render.");
            }
            this.setState({
                lastStateUpdate: new Date()
            });
        } else {
            this.tableData = modelData.tableData;
            this.valueDataType = data.valueDataType;
        }
    }

    private getDataFromService(): void {
        if (this.props.logToConsole) {
            this.logMessageToConsole("getDataFromService");
        }
        const { dataChangeDateAttr } = this.props;
        // We need a datachanged attribute value.
        if (dataChangeDateAttr?.value) {
            // Only if the date is different to prevent getting the data (especially web service) when the render is only about resizing etc.
            if (this.previousDataChangeDate && dataChangeDateAttr.value?.getTime() === this.previousDataChangeDate?.getTime()) {
                if (this.props.logToConsole) {
                    this.logMessageToConsole("getDataFromService: Date still the same.");
                }
                return;
            }
        } else {
            if (this.props.logToConsole) {
                this.logMessageToConsole("Data changed date is empty");
            }
            return;
        }

        this.logMessageToConsole("getDataFromService: Date changed.");

        // Store the date, also prevents multiple renders all triggering reload of the data.
        this.previousDataChangeDate = dataChangeDateAttr.value;

        const data = new Data();
        data.getDataFromService(this.props).then(() => {
            const { modelData } = data;
            if (modelData.errorArray && modelData.errorArray.length > 0) {
                this.errorArray = modelData.errorArray;
            } else {
                this.tableData = modelData.tableData;
                this.valueDataType = data.valueDataType;
            }
            if (this.props.logToConsole) {
                this.logMessageToConsole("getDataFromService: Received data from service, change the state to force render.");
            }
            this.setState({
                lastStateUpdate: new Date()
            });
        });
    }

    private logMessageToConsole(message: string): void {
        console.info(this.props.name + " " + new Date().toISOString() + " (widget) " + message);
    }
}
