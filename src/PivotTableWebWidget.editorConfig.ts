import { PivotTableWebWidgetPreviewProps } from "../typings/PivotTableWebWidgetProps";
import { hidePropertyIn, hidePropertiesIn, hideNestedPropertiesIn } from "@mendix/pluggable-widgets-tools";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: object; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    property: object; // widgets property object from Values API
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps = ImageProps | ContainerProps | RowLayoutProps | TextProps | DropZoneProps | SelectableProps | DatasourceProps;

export function getProperties(values: PivotTableWebWidgetPreviewProps, defaultProperties: Properties /* , target: Platform*/): Properties {
    // Do the values manipulation here to control the visibility of properties in Studio and Studio Pro conditionally.

    // Hide attribute related properties for count as no attribute value is used.
    if (values.cellValueAction === "count") {
        hidePropertiesIn(defaultProperties, values, ["precisionForNumbers", "cellValueDateformat", "cellValueAttr"]);
    }

    // Hide total column label if not applicable
    if (!values.showTotalColumn) {
        hidePropertyIn(defaultProperties, values, "totalColumnLabel");
    }

    // Hide total row label if not applicable
    if (!values.showTotalRow) {
        hidePropertyIn(defaultProperties, values, "totalRowLabel");
    }

    // Hide export properties if export not allowed
    if (!values.allowExport) {
        hidePropertiesIn(defaultProperties, values, [
            "exportType",
            "exportButtonCaption",
            "exportButtonClass",
            "exportFilenamePrefix",
            "exportFilenameDateformat",
            "exportDateformat"
        ]);
    }

    // Hide Excel layout properties unless exporting to Excel, both on the widget and on each conditional styling item.
    if (!isExcelExport(values)) {
        hidePropertiesIn(defaultProperties, values, [
            "excelHeaderFontColor",
            "excelHeaderFontBold",
            "excelHeaderBackgroundColor",
            "excelHeaderRotationDegree",
            "excelTopRowHeight",
            "excelFirstColumnWidth",
            "excelDataColumnWidth",
            "excelTotalColumnWidth"
        ]);
        values.conditionalStylingList.forEach((_item, index) => {
            hideNestedPropertiesIn(defaultProperties, values, "conditionalStylingList", index, ["excelFontColor", "excelFontBold", "excelBackgroundColor"]);
        });
    } else if (!values.showTotalColumn) {
        hidePropertyIn(defaultProperties, values, "excelTotalColumnWidth");
    }

    // Display action styles only apply to Excel export with cell value action display.
    if (!isExcelDisplayExport(values)) {
        hidePropertyIn(defaultProperties, values, "excelDisplayActionStyles");
    }

    return defaultProperties;
}

// Excel layout properties are only visible (and therefore only validated) when exporting to Excel.
function isExcelExport(values: PivotTableWebWidgetPreviewProps): boolean {
    return values.allowExport && values.exportType === "xlsx";
}

function isExcelDisplayExport(values: PivotTableWebWidgetPreviewProps): boolean {
    return isExcelExport(values) && values.cellValueAction === "display";
}

// ExcelJS color format: AARRGGBB, exactly 8 hexadecimal characters.
const ARGB_COLOR_REGEX = /^[0-9A-Fa-f]{8}$/;

// ExcelJS textRotation: -90 thru 90 degrees, or 255 for vertical text.
const EXCEL_ROTATION_VERTICAL = 255;

// Excel limits: row height in points, column width in characters.
const EXCEL_MAX_ROW_HEIGHT = 409;
const EXCEL_MAX_COLUMN_WIDTH = 255;

export function check(values: PivotTableWebWidgetPreviewProps): Problem[] {
    let errors: Problem[];
    switch (values.dataSourceType) {
        case "datasource":
            errors = checkDatasourceProps(values);
            break;

        case "serviceCall":
            errors = checkServiceProps(values);
            break;

        default:
            errors = [];
    }

    return errors.concat(checkExcelExportProps(values));
}

function checkExcelExportProps(values: PivotTableWebWidgetPreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (!isExcelExport(values)) {
        return errors;
    }

    const { excelHeaderFontColor, excelHeaderBackgroundColor, excelHeaderRotationDegree, conditionalStylingList } = values;

    checkArgbColor(errors, "excelHeaderFontColor", "Excel header font color", excelHeaderFontColor);
    checkArgbColor(errors, "excelHeaderBackgroundColor", "Excel header background color", excelHeaderBackgroundColor);

    // Integer property, null when the field is cleared in Studio Pro. Runtime default is 0, so empty is allowed.
    if (excelHeaderRotationDegree !== null && !isValidExcelRotation(excelHeaderRotationDegree)) {
        errors.push({
            property: "excelHeaderRotationDegree",
            message: "Excel header rotation must be between -90 and 90 degrees, or 255 for vertical text"
        });
    }

    checkExcelSize(errors, "excelTopRowHeight", "Excel top row height", values.excelTopRowHeight, EXCEL_MAX_ROW_HEIGHT);
    checkExcelSize(errors, "excelFirstColumnWidth", "Excel first column width", values.excelFirstColumnWidth, EXCEL_MAX_COLUMN_WIDTH);
    checkExcelSize(errors, "excelDataColumnWidth", "Excel data column width", values.excelDataColumnWidth, EXCEL_MAX_COLUMN_WIDTH);
    if (values.showTotalColumn) {
        checkExcelSize(errors, "excelTotalColumnWidth", "Excel total column width", values.excelTotalColumnWidth, EXCEL_MAX_COLUMN_WIDTH);
    }

    // Nested properties cannot be addressed directly, so report on the list and name the item.
    conditionalStylingList.forEach((item, index) => {
        const itemCaption = "Conditional styling item " + (index + 1);
        checkArgbColor(errors, "conditionalStylingList", itemCaption + ": Excel font color", item.excelFontColor);
        checkArgbColor(errors, "conditionalStylingList", itemCaption + ": Excel background color", item.excelBackgroundColor);
    });

    if (isExcelDisplayExport(values)) {
        values.excelDisplayActionStyles.forEach((item, index) => {
            const itemCaption = "Display action style " + (index + 1);
            checkArgbColor(errors, "excelDisplayActionStyles", itemCaption + ": Excel font color", item.fontColor);
            checkArgbColor(errors, "excelDisplayActionStyles", itemCaption + ": Excel background color", item.backgroundColor);
        });
    }

    return errors;
}

function checkArgbColor(errors: Problem[], property: string, caption: string, value: string): void {
    // Color properties are optional, only validate when a value was entered.
    const trimmedValue = value ? value.trim() : "";
    if (trimmedValue && !ARGB_COLOR_REGEX.test(trimmedValue)) {
        errors.push({
            property,
            message: caption + " '" + value + "' is not a valid ARGB color. Use 8 hexadecimal characters (AARRGGBB), for example FFFF0000 for red"
        });
    }
}

function checkExcelSize(errors: Problem[], property: string, caption: string, value: number | null, maxValue: number): void {
    // Integer property, null when the field is cleared in Studio Pro. Runtime default is 0 (no action), so empty is allowed.
    if (value !== null && (value < 0 || value > maxValue)) {
        errors.push({
            property,
            message: caption + " must be between 0 and " + maxValue + ", 0 leaves it to Excel"
        });
    }
}

function isValidExcelRotation(degree: number): boolean {
    return (degree >= -90 && degree <= 90) || degree === EXCEL_ROTATION_VERTICAL;
}

function checkCommonProps(values: PivotTableWebWidgetPreviewProps): Problem[] {
    const errors: Problem[] = [];
    const { cellValueAction, showTotalColumn, showTotalRow, conditionalStylingList } = values;

    // Check whether total row/column is allowed
    if (cellValueAction !== "count" && cellValueAction !== "sum") {
        // Total row/column only allowed for count and sum
        if (showTotalColumn) {
            errors.push({
                property: "showTotalColumn",
                message: "Total column is only supported for count and sum"
            });
        }
        if (showTotalRow) {
            errors.push({
                property: "showTotalRow",
                message: "Total row is only supported for count and sum"
            });
        }
    }

    if (cellValueAction === "display" && conditionalStylingList.length > 0) {
        errors.push({
            property: "cellValueAction",
            message: "Conditional styling is not allowed for action Display"
        });
    }

    return errors;
}

function checkDatasourceProps(values: PivotTableWebWidgetPreviewProps): Problem[] {
    const errors = checkCommonProps(values);
    const { ds, cellValueAction, cellValueAttr, xIdAttr, xLabelAttr, xSortAttr, yIdAttr, yLabelAttr, ySortAttr } = values;

    if (!ds) {
        errors.push({
            property: "ds",
            message: "Datasource not configured"
        });
    }
    if (!cellValueAttr && cellValueAction !== "count") {
        errors.push({
            property: "cellValueAttr",
            message: "Cell value not set"
        });
    }
    if (!xIdAttr) {
        errors.push({
            property: "xIdAttr",
            message: "X-axis ID not set"
        });
    }
    if (!yIdAttr) {
        errors.push({
            property: "yIdAttr",
            message: "Y-axis ID not set"
        });
    }
    if (xSortAttr === "label") {
        if (!xLabelAttr) {
            errors.push({
                property: "xLabelAttr",
                message: "X-axis label not set and sort is by label. Sort by ID or set a label attribute"
            });
        }
    }
    if (ySortAttr === "label") {
        if (!yLabelAttr) {
            errors.push({
                property: "yLabelAttr",
                message: "Y-axis label not set and sort is by label. Sort by ID or set a label attribute"
            });
        }
    }

    return errors;
}

function checkServiceProps(values: PivotTableWebWidgetPreviewProps): Problem[] {
    const errors = checkCommonProps(values);
    const { dataChangeDateAttr, serviceUrl } = values;

    if (!serviceUrl) {
        errors.push({
            property: "serviceUrl",
            message: "Service URL not set"
        });
    }

    if (!dataChangeDateAttr) {
        errors.push({
            property: "dataChangeDateAttr",
            message: "Data changed date attribute not set"
        });
    }

    return errors;
}

// export function getPreview(values: EmptyWebTsPreviewProps, isDarkMode: boolean): PreviewProps {
//     // Customize your pluggable widget appearance for Studio Pro.
//     return {
//         type: "Container",
//         children: []
//     }
// }

// export function getCustomCaption(values: EmptyWebTsPreviewProps, platform: Platform): string {
//     return "EmptyWebTs";
// }
