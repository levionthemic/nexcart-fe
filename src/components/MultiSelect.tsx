import { useState } from 'react'
import MultipleSelector from '@/components/ui/multiselect'

export default function MultiSelect({ shops, updateShopIds }) {
  const [options] = useState([])
  const handleChange = (data) => {
    updateShopIds(data.map(item => item.value))
  }
  return (
    <div className="*:not-first:mt-2">
      <MultipleSelector

        commandProps={{
          label: 'Select frameworks'
        }}
        onChange={handleChange}
        value={options}
        defaultOptions={shops}
        placeholder="Select frameworks"
        hideClearAllButton
        hidePlaceholderWhenSelected
        emptyIndicator={<p className="text-center text-sm">No results found</p>} />
    </div>
  )
}
