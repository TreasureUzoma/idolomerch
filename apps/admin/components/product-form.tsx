"use client"
import { useEffect, useState } from "react"

interface ProductFormProps {
  mode: "create" | "edit"
  initialData?: any
  onSubmit: (formData: any) => void
}

interface ColorOption {
  name: string
  image: string // base64
}

export default function ProductForm({ mode, initialData, onSubmit }: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [price, setPrice] = useState(initialData?.price || 0)
  const [currency, setCurrency] = useState(initialData?.currency || "USD")
  const [category, setCategory] = useState(initialData?.category || "")
  const [status, setStatus] = useState(initialData?.status || "active")
  const [stock, setStock] = useState(initialData?.stock || 0)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [sizes, setSizes] = useState<string[]>(initialData?.options?.sizes || [])
  const [moreDetails, setMoreDetails] = useState<string[]>(initialData?.moreDetails || [])
  const [colors, setColors] = useState<ColorOption[]>(initialData?.options?.colors || [])
  const [mainImage, setMainImage] = useState(initialData?.image || "")

  // Input states for comma-separated fields
  const [tagInput, setTagInput] = useState(tags.join(", "))
  const [sizeInput, setSizeInput] = useState(sizes.join(", "))
  const [detailInput, setDetailInput] = useState(moreDetails.join(", "))
  const [newColorName, setNewColorName] = useState("")

  // Sync input fields with arrays
  useEffect(() => {
    setTags(
      tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t),
    )
  }, [tagInput])

  useEffect(() => {
    setSizes(
      sizeInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    )
  }, [sizeInput])

  useEffect(() => {
    setMoreDetails(
      detailInput
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d),
    )
  }, [detailInput])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleMainImageUpload = async (file: File) => {
    try {
      const base64 = await convertToBase64(file)
      setMainImage(base64)
    } catch (error) {
      console.error("Error converting image:", error)
    }
  }

  const handleColorImageUpload = async (index: number, file: File) => {
    try {
      const base64 = await convertToBase64(file)
      const updatedColors = [...colors]
      updatedColors[index].image = base64
      setColors(updatedColors)
    } catch (error) {
      console.error("Error converting image:", error)
    }
  }

  const addColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), image: "" }])
      setNewColorName("")
    }
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    const formData = {
      id: initialData?.id || `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title,
      description,
      price,
      currency,
      category,
      image: mainImage,
      status,
      stock,
      options: {
        sizes: sizes.filter((s) => s),
        colors: colors.filter((c) => c.name),
      },
      tags: tags.filter((t) => t),
      moreDetails: moreDetails.filter((d) => d),
    }
    onSubmit(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">{mode === "edit" ? "Edit Product" : "Create New Product"}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter product title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Clothing, Electronics"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={price}
                    onChange={(e) => setPrice(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={stock}
                    onChange={(e) => setStock(Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Image Upload */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Main Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleMainImageUpload(e.target.files[0])}
                    className="hidden"
                    id="main-image"
                  />
                  <label htmlFor="main-image" className="cursor-pointer">
                    {mainImage ? (
                      <img
                        src={mainImage || "/placeholder.svg"}
                        alt="Main product"
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="py-8">
                        <div className="text-4xl text-gray-400 mb-2">📷</div>
                        <p className="text-gray-500">Click to upload main image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tags, Sizes, Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="t-shirt, cotton, logo"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Available Sizes</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="S, M, L, XL"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Care Instructions</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Machine washable, Do not bleach"
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Color Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Color Options</label>

            {/* Add New Color */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter color name (e.g., Black, White)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addColor()}
              />
              <button
                type="button"
                onClick={addColor}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Color
              </button>
            </div>

            {/* Color List */}
            {colors.length > 0 && (
              <div className="space-y-4">
                {colors.map((color, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800 capitalize">{color.name}</h4>
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleColorImageUpload(index, e.target.files[0])}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      {color.image && (
                        <img
                          src={color.image || "/placeholder.svg"}
                          alt={color.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full bg-background text-white py-4 rounded-lg hover:from-blue-700 hover:bg-background/70 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {mode === "edit" ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
