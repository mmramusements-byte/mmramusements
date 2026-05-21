import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const PAGE_SIZE = 10;

export default function DataTable({ data = [], columns, searchable = true }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  // Compute showing X-Y of Z
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div>
      {/* ── Toolbar: search ── */}
      {searchable && (
        <div className="adm-toolbar">
          <div className="adm-search-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search…"
              value={globalFilter}
              onChange={(e) => {
                setGlobalFilter(e.target.value);
                setPagination((p) => ({ ...p, pageIndex: 0 }));
              }}
              className="adm-input adm-search-input"
              style={{ fontSize: '13px' }}
            />
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={canSort ? 'sortable' : ''}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ userSelect: 'none' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {canSort && (
                          <span
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              color: sorted
                                ? '#6366f1'
                                : 'rgba(241,241,243,0.25)',
                            }}
                          >
                            {sorted === 'asc' ? (
                              <ChevronUp size={13} />
                            ) : sorted === 'desc' ? (
                              <ChevronDown size={13} />
                            ) : (
                              <ChevronsUpDown size={13} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: 'center', padding: '40px 16px' }}
                >
                  <div className="adm-empty">
                    <p style={{ marginBottom: '4px', fontWeight: 500 }}>
                      No results found
                    </p>
                    {globalFilter && (
                      <p style={{ fontSize: '12px' }}>
                        Try a different search term.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalRows > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {/* Showing X-Y of Z */}
          <span
            style={{
              fontSize: '12.5px',
              color: 'rgba(241,241,243,0.45)',
            }}
          >
            Showing{' '}
            <span style={{ color: '#f1f1f3', fontWeight: 500 }}>
              {from}–{to}
            </span>{' '}
            of{' '}
            <span style={{ color: '#f1f1f3', fontWeight: 500 }}>{totalRows}</span>{' '}
            result{totalRows !== 1 ? 's' : ''}
          </span>

          {/* Prev / Page info / Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon"
              style={{
                opacity: table.getCanPreviousPage() ? 1 : 0.4,
                padding: '6px',
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <span
              style={{
                fontSize: '12.5px',
                color: 'rgba(241,241,243,0.6)',
                minWidth: '80px',
                textAlign: 'center',
              }}
            >
              Page{' '}
              <span style={{ color: '#f1f1f3', fontWeight: 500 }}>
                {pageIndex + 1}
              </span>{' '}
              of{' '}
              <span style={{ color: '#f1f1f3', fontWeight: 500 }}>
                {pageCount || 1}
              </span>
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="adm-btn adm-btn-secondary adm-btn-sm adm-btn-icon"
              style={{
                opacity: table.getCanNextPage() ? 1 : 0.4,
                padding: '6px',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
