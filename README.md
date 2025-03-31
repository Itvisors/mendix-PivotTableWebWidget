# PivotTableWebWidget
Pivot table widget for web pages. This widget replaces the
[Pivot table widget](https://appstore.home.mendix.com/link/app/34298/ITvisors/Pivot-Table-Widget), referenced in this documentation as the old widget.

# Features
- Use a datasource or a REST service call for the data.
- Perform actions on the data in each cell.
- React to click events on the cells.
- Apply styling thresholds to highlight certain values
- Apply custom styling to the X and Y labels
- Export the table data as CSV
- When there is no data, no table will be rendered but a (configurable) text will be shown.

# Entity to use
Because non persistent entities are kept in the client state, these are not the preferred way when using a datasource. It is best to use persistent entities and make sure the objects are committed.

However, implementations using the old widget probably use non-persistent entities because that was the preferred way for Mendix before release 7.

Especially when using non-persistent entities it is best to use a web service rather than a datasource because the web service does not return Mendix objects but only JSON data.

# Migrating from the old pivot table widget
Migration depends on whether you currently use persistent data directly in the widget.

## Persistent entity
When you returned persistent objects to the old widget, just configure that entity on the datasource. Note that the datasource attributes allow retrieve over association.

## Non-persistent entity
As mentioned earlier, returning a list of non-persistent data to the client causes a lot of clutter in the client state because the Mendix client keeps track of the non-persistent objects and cannot tell whether the widget is done with them.

The easiest way forward is to create a published REST service and use that in the widget. As a bonus most of the times performance will be much better.

## Message definitions
You don't have to rename your existing entities to make them fit! Don't forget that **Message definitions** in Studio Pro can rename attributes, using the external single item name, so the export mapping will export using the names the widget expects. (See below for the expected names.) 

# Web service
The widget can call webservices, which can improve performance, especially for larger datasets. As no Mendix objects are transferred, only JSON, the result will not impact the client state. Combining this with OQL to aggegate your data in the backend can be a great combination. You can specify additional parameters to include on the service call.

## The Data changed date attribute
Pluggable widgets are rendered **really** often due to the way React works. Clicking buttons, conditional visibility elsewhere on the page, changing the context object or opening a popup are examples. 

To prevent lots of unnecessary server roundtrips, the widget will only call the web service to reload the data when the value of the data changed date attribute changes.
So whenever you want the widget to refresh, set the attribute to current date/time in your microflow. When the date did not change, the widget will just render the data loaded in a previous render.

## Only to the app backend
The widget will only call services on the app backend. If you wish to use external data, make that service call in your app logic.

## Authorization
Make sure that current session is (also) allowed for the web service because the widget will use the current session to authenticate.

## Service parm value
The widget can pass the guid of the context object as query parameter, parameter name will be context. Useful for anonymous services or other situations where you need to know the context of the service call

## Query parameters
Enter any other parameters you want to add to the service call. 

## Result
The service should return a list of data items in the following format:

| Element     | Req.? | Description |
|-------------|:-:|--|
| idValueX    | Y | ID value for the X axis |
| labelValueX |   | Label value for the X axis, ID value will be used if empty |
| classValueX |   | CSS class to use for the label for the X axis, ignored if empty |
| idValueY    | Y | ID value for the Y axis |
| labelValueY |   | Label value for the Y axis, ID value will be used if empty |
| classValueY |   | CSS class to use for the label for the Y axis, ignored if empty |
| value       | ? | Value, required when Cell value action is not Count |

The values can either be strings or numbers, depending on the type of data returned. As JSON does not know about dates, a date is to be transmitted as UTC date string, format: 2020-09-15T09:53:56.771Z, the widget will process it as a date.

Don't forget you can change the name of the response element in the message definition in Studio Pro using the external single item name.

For ID values, it is best to format the dates in the backend as aggregation usually takes place on an entire month or year. The key is then yyyyMM or just yyyy.

The demo project has an example of the service and mappings.

# Cell value actions
No cell value attribute is necessary when objects are to be counted. Decimal, integer and long can be used on any action, DateTime only for Min and Max.

Decimal precision can be set separately for the decimal cell value and for average calculation.

# Totals
The pivot table widget can display an additional column and row for the totals, only for actions Count and Sum.

# CSS classes
The widget renders a div with class pivotTableWidget that contains the actual table. This div will also have any classes set on the widget in Mendix.

By default cell values are centered.

## Classes used by the widget
| Class                      | Description |
|----------------------------|-
| pivotTableTopLeft          | Topleft cell
| pivotTableColumnHeader     | th of column header. If you set the value of classValueX in your data items or set the X-axis CSS class for the datasource the value is added to the classes on the th column headers. 
| pivotTableRowHeader        | th of row header.  If you set the value of classValueY in your data items or set the Y-axis CSS class for the datasource the value is added to the classes on the th row headers.
| pivotTableColumnTotal      | td of the column total
| pivotTableRowTotal         | td of the row total
| pivotTableCell             | the td of a cell with a value
| pivotTableCellEmpty        | the td of a cell with no value


## Classes available for use
Put the class on the widget in Mendix.
| Class                      | Description |
|----------------------------|-
| pivotTableWidgetStriped    | Alternating row colors.
| cellLeft                   | Left align cell data
| cellRight                  | Right align cell data and column headers

## Rotated column headers
Getting rotated column headers right is a little tricky because of the math involved. The demo project has a tool to generate CSS for rotated column headers.

## Conditional styling
To apply styling to a cell based on its value, use the conditional styling properties. For example, give all low values a red color and the high values a green color, leaving the intermediate ones default. For each style, set a lower limit using a decimal or date value and, optionally, a class. The settings would be:

| Class                    | Value |
|--------------------------|------:|
| background-danger-light  | 0     |
| (none)                   | 100   |
| background-success-light | 500   |

The effect is that any values lower than 100 will get class background-danger-light, no class is set for any values from 100 up to 500. Any values of 500 and over will get class background-success-light.

These classes are supplied by Atlas UI Resource in the theme folder. You can of course create your own classes and use these.

Note that the widget will order the styling items on ascending value, but for readability it is probably best if you order them on value anyway.

## Styling for display action
The display action allows an additional class to be specified, containing the actual value. Most effective for a small number of unique values or enumerations. The class name will start with the fixed value display- followed by the actual value in lower case. Note that any values other than a thru z and 0 thru 9 are replaced by _ in the class name.

# Click handling
When the user clicks a cell, the widget will call the action configured on the widget.

For Mendix 10.21 and newer, the parameters are passed as action variables onClickX and onClickY to the microflow or nanoflow. When you select a microflow or nanoflow as action, you can configure the action variables as parameters.

For earlier Mendix releases, the widget will set the X and Y id values on the context object.

# Export

The widget can export the table data as CSV. For Mendix 10.21 and newer, the file download is triggered directly from the browser.

For earlier Mendix releases, the export relies on the backend to handle the file creation. You will need to do the following:
- Create an entity that inherits from FileDocument to create the CSV file.
- Create a microflow that handles the export:
    - Create an object of the entity that inherits from FileDocument. Unless the document needs to be kept, be sure to set DeleteAfterDownload to true.
	- Use CommunityCommons.StringToFile to store the CSV data in the file document.
    - Clear the export data on the context object to reduce its size.
	- Use the Download File activity to actually download the file.

The demo project has microflow ACT_ExportToCsv that performs these actions.

# Demo project
https://testpivottablewebwidget-sandbox.mxapps.io/

# Issues, suggestions and feature requests
https://github.com/Itvisors/mendix-PivotTableWebWidget/issues
