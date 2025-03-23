import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "../ui/input";

interface CashTableProps {
  onDataChange: (updatedNotesData: Note[], total: number) => void;
}

export interface Note {
  note: number | string;
  count: string;
}

const CashTable: React.FC<CashTableProps> = ({ onDataChange }) => {
  const [notesData, setNotesData] = useState<Note[]>([
    { note: 500, count: "" },
    { note: 200, count: "" },
    { note: 100, count: "" },
    { note: 50, count: "" },
    { note: 20, count: "" },
    { note: 10, count: "" },
    { note: "others", count: "" },
  ]);

  const handleInputChange = (index: number, value: string) => {
    const updatedNotesData = [...notesData];

    if (updatedNotesData[index].note === "others") {
      updatedNotesData[index].count = value;
    } else {
      updatedNotesData[index].count = Math.max(
        0,
        parseInt(value) || 0
      ).toString();
    }

    setNotesData(updatedNotesData);

    const total = calculateTotal(updatedNotesData);
    onDataChange(updatedNotesData, total);
  };

  const calculateTotal = (data: Note[]): number => {
    return data.reduce((sum, row) => {
      if (typeof row.note === "number") {
        return sum + row.note * (parseInt(row.count) || 0);
      } else if (row.note === "others") {
        return sum + (parseFloat(row.count) || 0);
      }
      return sum;
    }, 0);
  };

  const total = calculateTotal(notesData);

  return (
    <div className="overflow-hidden border">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800 bg-muted/50">
          <tr>
            <th className="border border-gray-500 border-muted/90 dark:border-muted/50 px-4 py-3 bg-[#00000008] text-left">
              Notes
            </th>
            <th className="border border-gray-500 border-muted/90 dark:border-muted/50 px-4 py-3 bg-[#00000008]">
              Count
            </th>
          </tr>
        </thead>
        <tbody>
          {notesData.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-500 border-muted/90 dark:border-muted/50 px-4 py-2 text-sm">
                {row.note}
              </td>
              <td className="border border-gray-500 border-muted/90 dark:border-muted/50">
                <Input
                  type="number"
                  value={row.count}
                  placeholder="0"
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="w-full px-3 py-2 outline-none rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-none"
                />
              </td>
            </tr>
          ))}
          <tr>
            <th
              colSpan={2}
              className="border border-gray-500 border-muted/90 dark:border-muted/50 px-4 py-2 bg-gray-800 bg-muted/50 text-left font-semibold">
              Grand Total
            </th>
            <td className="border border-gray-500 border-muted/90 dark:border-muted/50 px-4 py-2 text-right font-bold">
              ₹ {total.toLocaleString("en-IN")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

CashTable.propTypes = {
  // initialCash: PropTypes.number.isRequired,
  onDataChange: PropTypes.func.isRequired,
};

export default CashTable;
