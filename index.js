'use strict';

const color = require("cli-color");

class CliTable
{
    /**
     * @constructor
     */
    constructor()
    {
        this.tableTitle = 'Default Table';
        this.tableLength = process.stdout.columns;
        this.tableColor = 'white';
        this.tableColumns = [];
        this.tableRows = [];

        this.showingTableRows = [];

        this.lineLength = this.tableLength;
        this.inputLine = '';

        for (let i = 0; i < this.tableLength; i++)
        {
            this.inputLine += " ";
        }
    }

    /**
     * @function SetTableTitle
     * @summary Sets the header-title of the Table.
     * @param {string} tableTitle - Title of the table.
     */
    SetTableTitle(tableTitle)
    {
        this.tableTitle = tableTitle
    }
    
    /**
     * @function SetTableColor
     * @summary Sets background-color of the Table.
     * @param {string} inputColor - Color of the table and/or background.
     */
    SetTableColor(inputColor)
    {
        this.tableColor = inputColor
    }

    /**
     * @function SetTableLength
     * @summary Sets the length-in-letters of the Table.
     * @param {number} length - Lenghts(width) of the Table.
     */
    SetTableLength(length)
    {
        this.tableLength = length
    }

    /**
     * @function SetTableColumns
     * @summary Gets and sets an array-object of the columns used in the table.
     * @param {object} tableColumns - List of columns/keys the table will use.
     */
    SetTableColumns(tableColumns)
    {
        this.tableColumns = tableColumns
    }

    /**
     * @function SetTableRows
     * @summary Gets and Sets an array-object of the rows used in the table.
     * @param {object} tableRows - List of rows with data to be used in the table.
     */
    SetTableRows(tableRows)
    {
        this.tableRows = tableRows
    }

    /**
     * @function GetRowAmount
     * @summary Gets the amount of rows used in the table and returns it.
     * @returns {number}
     */
    GetRowAmount()
    {
        return this.showingTableRows.length;
    }

    /**
     * @function HandlePadding
     * @summary Handles padding to either side of the line text and returns a string filled with spaces.
     * @param {number} length - Length of padding.
     * @returns {string}
     */
    HandlePadding(length)
    {
        let tempString = '';

        for (let i = 0; i < length; i++)
        {
            tempString += ' ';
        }

        return tempString;
    }

    /**
     * @function CreateTableColumn
     * @summary Creates a column, and fills it with text and returns it. Optional, 
     *          it can also change column appearance for the first column in a line.
     * @param {string} text - Text displayed inside of the column.
     * @param {number} width - Width of the column.
     * @param {boolean} first - Is first column in row?
     * @returns {string}
     */
    CreateTableColumn(text, width, first)
    {
        const columnSize = width - 2;

        let tempString = `${first ? '' : '|' } ` + text.toString();

        tempString += this.HandlePadding(columnSize - text.toString().length);

        tempString += " ";

        this.lineLength -= tempString.length;

        return tempString;
    }

    /**
     * @function CreateTableTitle
     * @summary Creates a string containing the title of the table centered and underlined and returns it.
     * @returns {string}
     */
    CreateTableTitle()
    {
        let titlePadding = Math.round((this.tableLength - this.tableTitle.length) / 2);

        let tempString = `\n${this.HandlePadding(titlePadding)}${this.tableTitle}${this.HandlePadding(titlePadding)}\n`;

        return tempString.substr(0, this.tableLength + 1);
    }

    /**
     * @function CreateTableHeader
     * @summary Creates the header of the table, including all its columns and returns it.
     * @returns {string}
     */
    CreateTableHeader()
    {
        let headerString = '';

        this.tableColumns.forEach((element, i) =>
        {
            headerString += this.CreateTableColumn(
                element.title ||
                element.key,
                element.width ||
                element.title.length ||
                element.key.length,
                i === 0 ? true : false
            );
        });

        const lineLength = this.tableLength - headerString.length;

        if (headerString.length <= this.tableLength)
        {
            headerString += this.HandlePadding(lineLength);
        }

        return headerString.substr(0, this.tableLength);
    }

    /**
     * @function CreateTableRow
     * @summary Creates a row filled with columns and returns it.
     * @param {string} rowContent - Content of a single row, derived from input.
     * @returns {string}
     */
    CreateTableRow(rowContent)
    {
        this.lineLength = this.tableLength;

        let tempRowString = '';

        this.showingTableRows.push(rowContent);

        for (let column in rowContent)
        {
            this.tableColumns.forEach((element, i) =>
            {
                if (element.key === column)
                {
                    tempRowString += this.CreateTableColumn(rowContent[column], element.width, i == 0 ? true : false);
                }
            });
        }

        tempRowString += this.HandlePadding(this.lineLength)

        return tempRowString;
    }

    /**
     * @function CreateTableBody
     * @summary Creates the body of the table, including title, header, and body.
     */
    CreateTableBody()
    {
        console.log(color[this.tableColor].bold.underline(this.CreateTableTitle()));

        console.log('\n' + color[this.tableColor].inverse.bold(this.CreateTableHeader()));

        this.tableRows.forEach(element =>
        {
            this.AddTableRow(element);
        });

        return true;
    }

    /**
     * @function CreateTableFooter
     * @summary Creates the footer of the table, including right aligned text with one space padding to the right.
     * @param {string} text - Text displayed in footer.
     * @returns {string}
     */
    CreateTableFooter(text)
    {
        let footerString = "";
        let footerStringLength = text.length;

        for (let i = 0; i < (this.tableLength - footerStringLength) - 1; i++)
        {
            footerString += ' ';
        }

        footerString += text + ' ';

        return footerString.substr(0, this.tableLength);
    }

    /**
     * @function AddTableRow
     * @summary Adds a row to the table and colorizes it according to its state. 
     *          Can also be used after creation to interactively add new rows to the table.
     * @param {string} rowContent - Content of a single row, derived from input.
     * @param {boolean} rowState - State of the row information: null (default), "success", "warning" and "danger"
     */
    AddTableRow(rowContent, rowState = null)
    {
        if (rowState === null)
        {
            console.log(color[this.tableColor](this.CreateTableRow(rowContent)));    
        }
        else if(rowState === 'success')
        {
            console.log(color[this.tableColor]['bgGreen'](this.CreateTableRow(rowContent)));    
        }
        else if (rowState === 'warning')
        {
            console.log(color[this.tableColor]['bgYellow'](this.CreateTableRow(rowContent)));    
        }
        else if (rowState === 'danger')
        {
            console.log(color[this.tableColor]['bgRed'](this.CreateTableRow(rowContent)));    
        }
    }

    /**
     * @function AddTableFooter
     * @summary Adds a footer to the table. 
     */
    AddTableFooter(text)
    {
        console.log(color.bold.bgWhite.black(this.CreateTableFooter(text)) + '\n');
    }

    /**
     * @function ShowTable
     * @summary Shows the table, this is used to initialize CreateTableBody().
     * @see CreateTableBody
     */
    ShowTable()
    {
        this.CreateTableBody();
    }
}

module.exports = CliTable;
