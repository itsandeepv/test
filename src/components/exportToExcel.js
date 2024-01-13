import React from "react";
import { utils, writeFile } from 'xlsx';

export const ExportExcel = (column, data) => {
    var wb = utils.book_new();
    var ws = utils.book_new();
    var ws = utils.aoa_to_sheet([column, ...data]);
    utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
    utils.book_append_sheet(wb, ws, "Expense")
    writeFile(wb, 'Expense.xlsx')
}
