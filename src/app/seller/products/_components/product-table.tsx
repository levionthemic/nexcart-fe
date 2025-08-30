'use client'

import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ColumnDef,
  ColumnFilter,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderContext,
  Row,
  useReactTable
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  FilterIcon,
  ListFilterIcon,
  Pencil,
  PlusIcon,
  Trash,
  TrashIcon
} from 'lucide-react'
import { useId, useMemo, useRef, useState } from 'react'
import { useLoading } from '@/contexts/loading-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ProductListItem } from '@/types/entities/product'
import ProductDetailDialog from './product-detail-dialog'
import { DEFAULT_IMAGE_URL, DEFAULT_ITEMS_PER_PAGE } from '@/utils/constants'
import { CheckedState } from '@radix-ui/react-checkbox'

// Custom filter function for multi-column searching
const multiColumnFilterFn = (
  row: Row<ProductListItem>,
  columnId: string,
  filterValue: string
) => {
  const searchableRowContent =
    `${row.original.id} ${row.original.name}`.toLowerCase()
  const searchTerm = (filterValue ?? '').toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn = (
  row: Row<ProductListItem>,
  columnId: string,
  filterValue: string
) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const calculateAveragePrice = (product: ProductListItem) => {
  return Math.ceil(
    product.product_variants.reduce((sum, item) => item.price, 0) /
      product.product_variants.length
  )
}

const columns: ColumnDef<ProductListItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false
  },
  {
    id: 'thumbnail_url',
    header: 'Ảnh',
    accessorKey: 'thumbnail_url',
    cell: ({ row }) => (
      <Image
        src={row.getValue('thumbnail_url') || DEFAULT_IMAGE_URL}
        alt=''
        width={40}
        height={40}
        className='border border-gray-300 p-0.5 overflow-hidden rounded-md size-10'
      />
    ),
    size: 60,
    enableSorting: false
  },
  {
    id: 'name',
    header: 'Tên sản phẩm',
    accessorKey: 'name',
    cell: ({ row }) => (
      <div className='line-clamp-4 text-wrap font-medium'>
        {row.getValue('name')}
      </div>
    ),
    size: 200
  },
  {
    id: 'id',
    header: 'Mã SP',
    accessorKey: 'id',
    cell: ({ row }) => (
      <div className='line-clamp-4 text-wrap font-medium'>
        {row.getValue('id')}
      </div>
    ),
    size: 80,
    filterFn: multiColumnFilterFn,
    enableSorting: true
  },
  {
    id: 'category_id',
    header: 'Danh mục',
    accessorFn: (row) => row.category.id,
    cell: ({ row }) => (
      <div className='line-clamp-4 text-wrap'>{row.original.category.name}</div>
    ),
    size: 100,
    enableSorting: false
  },
  {
    id: 'brand_id',
    header: 'Thương hiệu',
    accessorFn: (row) => row.brand.id,
    cell: ({ row }) => (
      <div className='line-clamp-4 text-wrap'>{row.original.brand.name}</div>
    ),
    size: 100,
    enableSorting: false
  },
  {
    id: 'average_price',
    header: 'Giá trung bình',
    cell: ({ row }) => (
      <span className='font-bold'>
        {calculateAveragePrice(row.original).toLocaleString()}
        <sup>đ</sup>
      </span>
    ),
    size: 100
  },
  {
    id: 'rating',
    header: 'Đánh giá',
    accessorKey: 'rating',
    size: 65
  },
  {
    id: 'sold',
    header: 'Đã bán',
    accessorKey: 'sold',
    size: 50
  },
  {
    id: 'created_at',
    header: 'Ngày tạo',
    accessorKey: 'created_at',
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue('created_at')).toLocaleString('vi-vn')}
      </span>
    ),
    size: 100
  },
  {
    id: 'updated_at',
    header: 'Ngày cập nhật',
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue('updated_at')).toLocaleString('vi-vn')}
      </span>
    ),
    accessorKey: 'updated_at',
    size: 100
  },
  {
    id: 'is_deleted',
    header: 'Trạng thái',
    accessorKey: 'is_deleted',
    cell: ({ row }) => (
      <Badge>{row.getValue('is_deleted') ? 'Đã xóa' : 'Bình thường'}</Badge>
    ),
    size: 85,
    enableResizing: false,
    enableSorting: false,
    filterFn: statusFilterFn
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Thao tác</div>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 85,
    enableResizing: false,
    enableHiding: false,
    enableSorting: false
  }
]

export default function ProductTable({
  data,
  setData
}: {
  data: ProductListItem[]
  setData: React.Dispatch<React.SetStateAction<ProductListItem[]>>
}) {
  const router = useRouter()
  const id = useId()
  const { apiLoadingCount } = useLoading()

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

  return (
    <div className='space-y-1'>
      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-3 bg-section p-3 rounded-lg'>
        <div className='font-semibold text-mainColor1-600'>
          Danh sách sản phẩm
        </div>

        <div className='flex items-center gap-3'>
          {/* Filter by name or email */}
          <div className='relative'>
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                'peer min-w-80 ps-9',
                Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9'
              )}
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(e) =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
              placeholder='Lọc theo tên hoặc mã sản phẩm...'
              type='text'
              aria-label='Lọc theo tên hoặc mã sản phẩm'
            />
            <div className='text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
              <ListFilterIcon size={16} aria-hidden='true' />
            </div>
            {Boolean(table.getColumn('name')?.getFilterValue()) && (
              <button
                className='text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
                aria-label='Clear filter'
                onClick={() => {
                  table.getColumn('name')?.setFilterValue('')
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden='true' />
              </button>
            )}
          </div>
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>
                <FilterIcon
                  className='-ms-1 opacity-60'
                  size={16}
                  aria-hidden='true'
                />
                Trạng thái
                {selectedStatuses.length > 0 && (
                  <span className='bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium'>
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto min-w-36 p-3' align='start'>
              <div className='space-y-3'>
                <div className='text-muted-foreground text-xs font-medium'>
                  Bộ lọc
                </div>
                <div className='space-y-3'>
                  {uniqueStatusValues.map((value, i) => (
                    <div key={value} className='flex items-center gap-2'>
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedStatuses.includes(value)}
                        onCheckedChange={(checked) =>
                          handleStatusChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className='flex grow justify-between gap-2 font-normal'
                      >
                        {value}{' '}
                        <span className='text-muted-foreground ms-2 text-xs'>
                          {statusCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <Columns3Icon
                  className='-ms-1 opacity-60'
                  size={16}
                  aria-hidden='true'
                />
                Hiển thị
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Hiển thị cột</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {typeof column.columnDef.header === 'function'
                        ? flexRender(column.columnDef.header, {
                            table,
                            column
                          } as HeaderContext<ProductListItem, unknown>)
                        : column.columnDef.header}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='flex items-center gap-3'>
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='ml-auto' variant='outline'>
                  <TrashIcon
                    className='-ms-1 opacity-60'
                    size={16}
                    aria-hidden='true'
                  />
                  Xóa
                  <span className='bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium'>
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
                  <div
                    className='flex size-9 shrink-0 items-center justify-center rounded-full border'
                    aria-hidden='true'
                  >
                    <CircleAlertIcon className='opacity-80' size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có chắc chắn muốn xóa?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể khôi phục. Hệ thống sẽ xóa vĩnh
                      viễn {table.getSelectedRowModel().rows.length} hàng đã
                      chọn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Xóa vĩnh viễn
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add user button */}
          <Button
            className='ml-auto'
            variant='outline'
            onClick={() => {
              router.push('/seller/products/add')
            }}
          >
            <PlusIcon
              className='-ms-1 opacity-60'
              size={16}
              aria-hidden='true'
            />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-section overflow-hidden border rounded-lg font-lexend font-light'>
        <Table
          className='table-fixed'
          // style={{
          //   width: table.getCenterTotalSize()
          // }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-muted/50'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='relative h-10 border-t select-none last:[&>.cursor-col-resize]:opacity-0'
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : 'none'
                      }
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize()
                        }
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          <span className='truncate'>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {{
                            asc: (
                              <ChevronUpIcon
                                className='shrink-0 opacity-60'
                                size={16}
                                aria-hidden='true'
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className='shrink-0 opacity-60'
                                size={16}
                                aria-hidden='true'
                              />
                            )
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ??
                            null}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              'absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:!bg-gray-100 before:translate-x-px'
                          }}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='truncate'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {apiLoadingCount ? 'Đang tải dữ liệu...' : 'Không có kết quả'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between gap-8'>
        {/* Results per page */}
        <div className='flex items-center gap-3'>
          <Label htmlFor={id} className='max-sm:sr-only'>
            Số dòng / trang
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger id={id} className='w-fit whitespace-nowrap'>
              <SelectValue placeholder='Select number of results' />
            </SelectTrigger>
            <SelectContent className='[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2'>
              {[5, 10, 20, 40].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className='text-muted-foreground flex grow justify-end text-sm whitespace-nowrap'>
          <p
            className='text-muted-foreground text-sm whitespace-nowrap'
            aria-live='polite'
          >
            <span className='text-foreground'>
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{' '}
            của{' '}
            <span className='text-foreground'>
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size='icon'
                  variant='outline'
                  className='disabled:pointer-events-none disabled:opacity-50'
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label='Go to first page'
                >
                  <ChevronFirstIcon size={16} aria-hidden='true' />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size='icon'
                  variant='outline'
                  className='disabled:pointer-events-none disabled:opacity-50'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label='Go to previous page'
                >
                  <ChevronLeftIcon size={16} aria-hidden='true' />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size='icon'
                  variant='outline'
                  className='disabled:pointer-events-none disabled:opacity-50'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label='Go to next page'
                >
                  <ChevronRightIcon size={16} aria-hidden='true' />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size='icon'
                  variant='outline'
                  className='disabled:pointer-events-none disabled:opacity-50'
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label='Go to last page'
                >
                  <ChevronLastIcon size={16} aria-hidden='true' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

function RowActions({ row }: { row: Row<ProductListItem> }) {
  return (
    <div className='flex justify-between'>
      <Button
        size='icon'
        variant='ghost'
        className='shadow-none hover:bg-amber-100 hover:text-amber-500 p-1'
        aria-label='Edit item'
      >
        <Pencil size={10} aria-hidden='true' />
      </Button>

      <Button
        size='icon'
        variant='ghost'
        className='shadow-none hover:bg-red-100 hover:text-red-500'
        aria-label='Delete item'
      >
        <Trash size={10} aria-hidden='true' />
      </Button>

      <ProductDetailDialog productProp={row.original} />
    </div>
  )
}
