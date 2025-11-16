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
import { ColumnDef, flexRender, HeaderContext } from '@tanstack/react-table'
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
  PlusIcon,
  TrashIcon
} from 'lucide-react'
import { useLoading } from '@/contexts/loading-context'
import { useRouter } from 'next/navigation'
import useTableHooks from '@/hooks/use-table-hooks'

export default function CustomTable<T extends { id: number }>({
  data,
  setData,
  columns,
  title,
  inputSearchPlaceholder
}: {
  data: T[]
  setData: React.Dispatch<React.SetStateAction<T[]>>
  columns: ColumnDef<T>[]
  title: string
  inputSearchPlaceholder: string
}) {
  const router = useRouter()
  const { apiLoadingCount } = useLoading()

  const {
    table,
    inputRef,
    uniqueStatusValues,
    statusCounts,
    selectedStatuses,
    handleStatusChange,
    handleDeleteRows,
    id
  } = useTableHooks<T>({ data, setData, columns })

  return (
    <div className='space-y-1'>
      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-3 bg-section p-3 rounded-lg'>
        <div className='font-semibold text-mainColor1-600'>{title}</div>

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
              placeholder={inputSearchPlaceholder}
              type='text'
              aria-label={inputSearchPlaceholder}
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
                          } as HeaderContext<T, unknown>)
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
            Thêm
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
