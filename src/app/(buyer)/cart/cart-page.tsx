'use client'

import { useDispatch, useSelector } from 'react-redux'
import {
  deleteItemAPI,
  selectCurrentCart,
  setCart,
  updateCartQuantityAPI
} from '@/redux/cart/cartSlice'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { RiSubtractFill } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { cloneDeep } from 'lodash'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  ChevronDown,
  ChevronUp,
  EllipsisIcon,
  Store,
  Trash2Icon
} from 'lucide-react'
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
import { useRef, useState } from 'react'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { AppDispatch } from '@/redux/store'
import { CartItem } from '@/types/entities/cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { OrderItem } from '@/types/entities/order'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function ClientCartPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector(selectCurrentCart)
  console.log(cart?.cartItems)

  const currentUser = useSelector(selectCurrentUser)

  const changesRef = useRef(new Map<string, CartItem>())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const updateQuantity = () => {
    const updates = Array.from<CartItem>(changesRef.current.values())

    Promise.all(
      updates.map(({ product, quantity }) =>
        dispatch(
          updateCartQuantityAPI({
            cartId: cart!.id,
            productId: product.id,
            typeId: product.type.id,
            quantity
          })
        )
      )
    ).then(() => {
      changesRef.current.clear()
    })
  }

  const handleChangeQuantity = (
    productId: string,
    typeId: string,
    inc: boolean
  ) => {
    const cloneCart = cloneDeep(cart)!
    let changedCartItem: CartItem = cloneCart.cartItems[0] // initialize
    cloneCart.cartItems = cloneCart.cartItems.map((item) => {
      const { product, quantity } = item
      if (product.id === productId && product.type.id === typeId) {
        changedCartItem = cloneDeep(item)
        if (inc) {
          if (quantity < product.shopProductType.stock) {
            changedCartItem.quantity = quantity + 1
          }
        } else {
          if (quantity > 1) {
            changedCartItem.quantity = quantity - 1
          }
        }
        return changedCartItem
      }
      return item
    })

    dispatch(setCart(cloneCart))

    if (currentUser) {
      const key = `${productId}-${typeId}`
      changesRef.current.set(key, changedCartItem)

      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        updateQuantity()
      }, 1000)
    }
  }

  const handleDeleteItemCart = ({ product }: CartItem) => {
    let cartItems = cloneDeep(cart?.cartItems)

    cartItems = cartItems?.filter(
      (item) =>
        !(
          item.product.id === product.id &&
          item.product.type.id === product.type.id
        )
    )

    const updateCart = cloneDeep(cart)
    if (updateCart && cartItems) {
      updateCart.cartItems = cartItems
      dispatch(setCart(updateCart))
    }

    if (currentUser && cart) {
      toast.promise(
        dispatch(
          deleteItemAPI({
            productId: product.id,
            typeId: product.type.id,
            cartId: cart.id
          })
        ).unwrap(),
        {
          loading: 'Đang xóa...',
          success: 'Xóa sản phẩm khỏi giỏ hàng thành công!',
          error: 'Đã có lỗi!'
        }
      )
    }
  }

  const columns: ColumnDef<CartItem>[] = [
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
      size: 30
    },
    {
      id: 'sellerName',
      header: 'Người bán',
      accessorFn: (row) => row.product.seller.id,
      cell: ({ row }) => (
        <div className='line-clamp-1 text-ellipsis'>
          {row.getValue('sellerName')}
        </div>
      ),
      size: 60,
      enableGrouping: true,
      enableHiding: true
    },
    {
      id: 'avatar',
      header: 'Ảnh',
      accessorFn: (row) => row.product.avatar,
      cell: ({ row }) => (
        <Image
          width={64}
          height={64}
          src={row.getValue('avatar') || DEFAULT_IMAGE_URL}
          alt={row.getValue('name')}
          className='rounded object-cover size-16'
        />
      ),
      size: 64
    },
    {
      id: 'name',
      header: 'Tên sản phẩm',
      accessorFn: (row) => row.product.name,
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('name')}</div>
      )
    },
    {
      id: 'price',
      header: 'Giá sản phẩm',
      accessorFn: (row) => row.product.type.price,
      cell: ({ row }) => (
        <div>
          {Number(row.getValue('price')).toLocaleString('vi-VN')}
          <sup>đ</sup>
        </div>
      ),
      size: 80
    },
    {
      id: 'typeName',
      header: 'Loại sản phẩm',
      accessorFn: (row) => row.product.type.name,
      cell: ({ row }) => <div>{row.getValue('typeName')}</div>
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-between p-1 border border-gray-300 rounded-lg w-fit'>
            <RiSubtractFill
              className='text-xl rounded-md cursor-pointer hover:bg-mainColor2-800/40'
              onClick={() => {
                handleChangeQuantity(
                  row.original.product.id,
                  row.original.product.type.id,
                  false
                )
              }}
            />
            <input
              value={row.getValue('quantity')}
              readOnly
              className='w-[30px] text-center mx-1.5 border-none outline-none text-md bg-transparent'
            />
            <IoMdAdd
              className='text-xl rounded-md cursor-pointer hover:bg-mainColor2-800/40'
              onClick={() => {
                handleChangeQuantity(
                  row.original.product.id,
                  row.original.product.type.id,
                  true
                )
              }}
            />
          </div>
        )
      },
      size: 80
    },
    {
      id: 'totalPrice',
      header: () => <div className='text-right'>Thành tiền</div>,
      cell: ({ row }) => {
        return (
          <div className='font-semibold text-right'>
            {(
              Number(row.getValue('price')) * Number(row.getValue('quantity'))
            ).toLocaleString('vi-VN')}
            <sup>đ</sup>
          </div>
        )
      },
      size: 80
    },
    {
      header: () => <div className='text-right'>Thao tác</div>,
      accessorKey: 'actions',
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-1'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className='hover:bg-red-200 hover:text-red-500 p-1.5 rounded-md cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
                <Trash2Icon className='size-4' />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteItemCart(row.original)}
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div
            className='hover:bg-gray-200 p-1.5 rounded-md cursor-pointer transition-all hover:ease-in-out hover:duration-300'
            onClick={() => router.push(`/product/${row.original.product.id}`)}
          >
            <EllipsisIcon className='size-4' />
          </div>
        </div>
      ),
      size: 80
    }
  ]

  const [grouping, setGrouping] = useState(['sellerName'])

  const table = useReactTable({
    data: cart?.cartItems || [],
    columns,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      grouping,
      expanded: true,
      columnVisibility: {
        sellerName: false
      }
    },
    onGroupingChange: setGrouping
  })

  const totalPrice = () => {
    if (!cart) return 0
    const rows = table.getRowModel().rows
    const result = rows.reduce((sum, row) => {
      let temp = 0
      if (row.getIsSelected() && !row.getIsGrouped()) {
        temp += Number(row.getValue('price')) * Number(row.getValue('quantity'))
      }
      return sum + temp
    }, 0)
    return result
  }

  const handleCheckout = () => {
    const rows = table.getRowModel().rows
    const selectedRows = rows
      .filter((row) => row.getIsSelected() && !row.getIsGrouped())
      .map((row) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { seller, shopProductType, ...rest } = row.original.product
        const product = cloneDeep(rest)
        return {
          product: product,
          quantity: Number(row.getValue('quantity'))
        }
      })
    if (!selectedRows.length) {
      toast.error('Bạn chưa chọn sản phẩm!')
      return
    }

    if (!currentUser) {
      toast.error('Bạn phải đăng nhập để có thể thực hiện thanh toán!', {
        position: 'top-right'
      })
      return
    }

    const orderItems: OrderItem[] = selectedRows.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity || 1
      }
    })

    sessionStorage.setItem('orderItems', JSON.stringify(orderItems))
    router.push('/checkout')
  }

  return (
    <div className='container mx-auto'>
      <div className='relative grid max-h-full grid-cols-4 gap-5 my-4 min-h-[95vh]'>
        <div className='col-span-3 py-4 h-fit'>
          <div className='mb-6 text-2xl font-semibold text-mainColor2-800'>
            Giỏ Hàng Của Bạn
          </div>
          {!cart || !cart?.cartItems?.length ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            <div>
              <Table className='table-fixed'>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className='hover:bg-transparent'
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            style={{ width: `${header.getSize()}px` }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table?.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      if (row.getIsGrouped()) {
                        // Nếu là hàng nhóm, hiển thị tiêu đề nhóm
                        return (
                          <TableRow
                            key={row.id}
                            className='cursor-pointer bg-mainColor1-100/50 hover:bg-mainColor1-100/50'
                            onClick={row.getToggleExpandedHandler()}
                          >
                            <TableCell colSpan={1}>
                              <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) =>
                                  row.toggleSelected(!!value)
                                }
                                aria-label='Select row'
                              />
                            </TableCell>
                            <TableCell colSpan={columns.length - 3}>
                              <div className='flex items-center gap-2'>
                                <Store />
                                <span>
                                  Tên người bán:{' '}
                                  {
                                    row.getGroupingValue(
                                      row.groupingColumnId!
                                    ) as string
                                  }{' '}
                                  <b>({row.subRows.length} sản phẩm)</b>
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {row.getCanExpand() && (
                                <div className='flex justify-end'>
                                  {row.getIsExpanded() ? (
                                    <ChevronUp />
                                  ) : (
                                    <ChevronDown />
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      }
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter className='bg-transparent'>
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={6}>Tổng thành tiền</TableCell>
                    <TableCell className='text-right'>
                      <div className='text-lg font-bold text-right total-price'>
                        {totalPrice()?.toLocaleString('vi-VN') || 0}
                        <sup>đ</sup>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </div>
        <div className='col-span-1 bg-[#ECEEF6] dark:bg-section sticky top-32 rounded-lg left-0 max-h-[80%] min-h-fit'>
          <div className='p-4 m-4 bg-white dark:bg-section brightness-125 rounded-lg'>
            <div className='py-4 text-sm font-semibold tracking-wide text-center uppercase text-mainColor1-600'>
              Tóm tắt
            </div>

            <Separator />

            <div className='flex justify-between my-4 text-sm'>
              <div className='flex flex-col gap-1.5'>
                <span>Tổng thành tiền</span>
                <span>Phí vận chuyển</span>
                <span>Giảm giá</span>
              </div>
              <div className='flex flex-col gap-1.5 items-end'>
                <span>
                  {totalPrice()?.toLocaleString('vi-VN') || 0}
                  <sup>đ</sup>
                </span>
                <span>
                  {(0).toLocaleString('vi-VN')}
                  <sup>đ</sup>
                </span>
                <span>
                  {(0).toLocaleString('vi-VN')}
                  <sup>đ</sup>
                </span>
              </div>
            </div>

            <Separator />

            <div className='flex items-end justify-between my-4'>
              <span className='font-semibold text-mainColor1-600'>
                Tổng tiền
              </span>
              <span className='text-xl font-bold text-mainColor1-800'>
                {totalPrice()?.toLocaleString('vi-VN') || 0}
                <sup>đ</sup>
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className='bg-mainColor1-800 w-full text-white uppercase py-4 text-center rounded-xl font-bold hover:drop-shadow-xl hover:scale-[102%] hover:duration-300 hover:bg-mainColor1-600 transition-all'
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
