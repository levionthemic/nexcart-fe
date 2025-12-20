'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { cloneDeep } from 'lodash'
import { ChevronDown, ChevronUp, EllipsisIcon, Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { RiSubtractFill } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

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
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useOrder } from '@/contexts/order-context'
import {
  deleteItemAPI,
  selectCurrentCart,
  setCart,
  updateCartQuantityAPI
} from '@/redux/cart/cartSlice'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser } from '@/redux/user/userSlice'
import { CartItem } from '@/types/entities/cart'
import { OrderItem } from '@/types/entities/order'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function CartPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector(selectCurrentCart)

  const currentUser = useSelector(selectCurrentUser)
  const { setOrderItems } = useOrder()

  const [pendingUpdates, setPendingUpdates] = useState<Map<string, CartItem>>(
    new Map()
  )

  const handleChangeQuantity = (product_variant_id: number, inc: boolean) => {
    const cloneCart = cloneDeep(cart)!
    let changedCartItem: CartItem = cloneCart.cart_items[0]

    cloneCart.cart_items = cloneCart.cart_items.map((item) => {
      const { product_variant, quantity } = item
      if (product_variant.id === product_variant_id) {
        changedCartItem = cloneDeep(item)
        if (inc) {
          const totalStock = product_variant.shop_product_variants.reduce(
            (sum, item) => sum + item.stock_quantity,
            0
          )
          if (quantity < totalStock) {
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
      const newMap = new Map(pendingUpdates)
      newMap.set(String(product_variant_id), changedCartItem)
      setPendingUpdates(newMap)
    }
  }

  // Debounce update API
  useEffect(() => {
    if (!pendingUpdates.size) return
    const timer = setTimeout(async () => {
      const updates = Array.from(pendingUpdates.values())
      await Promise.all(
        updates.map(({ product_variant, quantity }) =>
          dispatch(
            updateCartQuantityAPI({
              cart_id: cart!.id,
              product_variant_id: product_variant.id,
              quantity
            })
          )
        )
      )
      setPendingUpdates(new Map())
    }, 1000)

    return () => clearTimeout(timer)
  }, [pendingUpdates, dispatch, cart])

  const handleDeleteItemCart = ({ product_variant }: CartItem) => {
    let cart_items = cloneDeep(cart?.cart_items)

    cart_items = cart_items?.filter(
      (item) => !(item.product_variant.id === product_variant.id)
    )

    const updateCart = cloneDeep(cart)
    if (updateCart && cart_items) {
      updateCart.cart_items = cart_items
      dispatch(setCart(updateCart))
    }

    if (currentUser && cart) {
      toast.promise(
        dispatch(
          deleteItemAPI({
            product_variant_id: product_variant.id,
            cart_id: cart.id
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
      id: 'sellerId',
      header: 'Người bán',
      accessorFn: (row) => row.product_variant.product.seller.seller_id,
      cell: ({ row }) => (
        <div className='line-clamp-1 text-ellipsis'>
          {row.original.product_variant.product.seller.name}
        </div>
      ),
      size: 60,
      enableGrouping: true,
      enableHiding: true
    },
    {
      id: 'avatar',
      header: 'Ảnh',
      accessorFn: (row) => row.product_variant.image_url,
      cell: ({ row }) => (
        <Image
          width={64}
          height={64}
          src={row.getValue('avatar') || DEFAULT_IMAGE_URL}
          alt={row.getValue('name')}
          className='size-16 rounded object-cover'
        />
      ),
      size: 64
    },
    {
      id: 'name',
      header: 'Tên sản phẩm',
      accessorFn: (row) => row.product_variant.name,
      cell: ({ row }) => (
        <div className='font-medium'>{row.getValue('name')}</div>
      )
    },
    {
      id: 'price',
      header: 'Giá sản phẩm',
      accessorFn: (row) => row.product_variant.price,
      cell: ({ row }) => (
        <div>
          {Number(row.getValue('price')).toLocaleString('vi-VN')}
          <sup>đ</sup>
        </div>
      ),
      size: 80
    },
    {
      header: 'Số lượng',
      accessorKey: 'quantity',
      cell: ({ row }) => {
        return (
          <div className='flex w-fit items-center justify-between rounded-lg border border-gray-300 p-1'>
            <RiSubtractFill
              className='hover:bg-mainColor2-800/40 cursor-pointer rounded-md text-xl'
              onClick={() => {
                handleChangeQuantity(row.original.product_variant.id, false)
              }}
            />
            <input
              value={row.getValue('quantity')}
              readOnly
              className='text-md mx-1.5 w-[30px] border-none bg-transparent text-center outline-none'
            />
            <IoMdAdd
              className='hover:bg-mainColor2-800/40 cursor-pointer rounded-md text-xl'
              onClick={() => {
                handleChangeQuantity(row.original.product_variant.id, true)
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
          <div className='text-right font-semibold'>
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
              <div className='cursor-pointer rounded-md p-1.5 transition-all hover:bg-red-200 hover:text-red-500 hover:duration-300 hover:ease-in-out'>
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
            className='cursor-pointer rounded-md p-1.5 transition-all hover:bg-gray-200 hover:duration-300 hover:ease-in-out'
            onClick={() =>
              router.push(
                `/product/${row.original.product_variant.product.slug}`
              )
            }
          >
            <EllipsisIcon className='size-4' />
          </div>
        </div>
      ),
      size: 80
    }
  ]

  const [grouping, setGrouping] = useState(['sellerId'])
  // const [expanding, setExpanding] = useState<ExpandedState>(true)

  const table = useReactTable({
    data: cart?.cart_items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      grouping,
      expanded: true,
      columnVisibility: {
        sellerId: false
      }
    },
    onGroupingChange: setGrouping
    // onExpandedChange: setExpanding
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
        return {
          product_variant: row.original.product_variant,
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

    const order_items: OrderItem[] = selectedRows.map((item) => {
      return {
        product_variant: item.product_variant,
        quantity: item.quantity || 1,
        price_at_purchase: item.product_variant.price
      }
    })

    setOrderItems(order_items)
    router.push('/checkout/1')
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='relative grid max-h-full min-h-[95vh] grid-cols-4 gap-5'>
        <div className='col-span-3 h-fit py-4'>
          <div className='text-mainColor2-800 mb-6 text-2xl font-semibold'>
            Giỏ Hàng Của Bạn
          </div>
          {!cart || !cart?.cart_items?.length ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            <div className='bg-section h-[75vh] max-h-full rounded-lg p-4'>
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
                            className='bg-muted hover:bg-mainColor1-100/50 cursor-pointer'
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
                                <Image
                                  src={
                                    row.subRows[0]?.original.product_variant
                                      .product.seller.user.avatar
                                  }
                                  alt=''
                                  width={32}
                                  height={32}
                                  className='h-8 w-8 rounded-full object-cover'
                                />
                                <span>
                                  {
                                    row.subRows[0]?.original.product_variant
                                      .product.seller.name
                                  }{' '}
                                  <b>({row.subRows.length} sản phẩm)</b>
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {row.getCanExpand() && (
                                <div
                                  className='flex cursor-pointer justify-end'
                                  // onClick={row.getToggleExpandedHandler()}
                                >
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
                      <div className='total-price text-right text-lg font-bold'>
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
        <div className='dark:bg-section sticky top-32 left-0 col-span-1 max-h-[80%] min-h-fit rounded-lg bg-[#ECEEF6]'>
          <div className='dark:bg-section m-4 rounded-lg bg-white p-4 brightness-125'>
            <div className='text-mainColor1-600 py-4 text-center text-sm font-semibold tracking-wide uppercase'>
              Tóm tắt
            </div>

            <Separator />

            <div className='my-4 flex justify-between text-sm'>
              <div className='flex flex-col gap-1.5'>
                <span>Tổng thành tiền</span>
                <span>Phí vận chuyển</span>
                <span>Giảm giá</span>
              </div>
              <div className='flex flex-col items-end gap-1.5'>
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

            <div className='my-4 flex items-end justify-between'>
              <span className='text-mainColor1-600 font-semibold'>
                Tổng tiền
              </span>
              <span className='text-mainColor1-800 text-xl font-bold'>
                {totalPrice()?.toLocaleString('vi-VN') || 0}
                <sup>đ</sup>
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className='bg-mainColor1-800 hover:bg-mainColor1-600 w-full rounded-xl py-4 text-center font-bold text-white uppercase transition-all hover:scale-[102%] hover:drop-shadow-xl hover:duration-300'
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
