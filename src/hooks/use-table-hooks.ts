import { CheckedState } from '@radix-ui/react-checkbox'
import {
  ColumnDef,
  ColumnFilter,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable
} from '@tanstack/react-table'
import { useId, useMemo, useRef, useState } from 'react'

import { DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'

export default function useTableHooks<T extends { id: number }>({
  data,
  setData,
  columns
}: {
  data: T[]
  setData: React.Dispatch<React.SetStateAction<T[]>>
  columns: ColumnDef<T>[]
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_ITEMS_PER_PAGE
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const [sorting, setSorting] = useState([
    {
      id: 'name',
      desc: false
    }
  ])

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter(
      (item) => !selectedRows.some((row) => row.original.id === item.id)
    )
    setData(updatedData)
    table.resetRowSelection()
  }

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility
    }
  })

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn('is_deleted')

    if (!statusColumn) return []

    const values = Array.from(statusColumn.getFacetedUniqueValues().keys())

    return values.sort()
  }, [table])

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn('is_deleted')
    if (!statusColumn) return new Map()
    return statusColumn.getFacetedUniqueValues()
  }, [table])

  const selectedStatuses = useMemo(() => {
    const filterValue = table
      .getColumn('is_deleted')
      ?.getFilterValue() as boolean[]
    return filterValue ?? []
  }, [table])

  const handleStatusChange = (checked: CheckedState, value: boolean) => {
    const filterValue = table
      .getColumn('is_deleted')
      ?.getFilterValue() as boolean[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    table
      .getColumn('is_deleted')
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  // Custom filter function for multi-column searching
  const multiColumnFilterFn = (
    row: Row<T>,
    columnId: string,
    filterValue: string
  ) => {
    const searchableRowContent =
      `${row.original.id} ${(row.original as unknown as { name?: string }).name ?? ''}`.toLowerCase()
    const searchTerm = (filterValue ?? '').toLowerCase()
    return searchableRowContent.includes(searchTerm)
  }

  const statusFilterFn = (
    row: Row<T>,
    columnId: string,
    filterValue: string
  ) => {
    if (!filterValue?.length) return true
    const status = row.getValue(columnId) as string
    return filterValue.includes(status)
  }

  return {
    table,
    inputRef,
    uniqueStatusValues,
    statusCounts,
    selectedStatuses,
    handleStatusChange,
    handleDeleteRows,
    id: useId(),
    multiColumnFilterFn,
    statusFilterFn
  }
}
