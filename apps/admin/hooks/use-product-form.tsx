"use client";

import { useState, useEffect } from "react";

export interface ColorOption {
  name: string;
  image: File | null;
}

interface ProductFormInput {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  status?: string;
  stock?: number;
  tags?: string[];
  moreDetails?: string[];
  options?: {
    sizes?: string[];
    colors?: { name: string; image: string }[]; // image URL or reference string
  };
  image?: string;
  id?: string;
}

export function useProductForm(initialData: ProductFormInput = {}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || 0);
  const [currency, setCurrency] = useState(initialData.currency || "USD");
  const [category, setCategory] = useState(initialData.category || "");
  const [status, setStatus] = useState(initialData.status || "active");
  const [stock, setStock] = useState(initialData.stock || 0);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [sizes, setSizes] = useState<string[]>(initialData.options?.sizes || []);
  const [moreDetails, setMoreDetails] = useState<string[]>(initialData.moreDetails || []);
  const [colors, setColors] = useState<ColorOption[]>(
    (initialData.options?.colors || []).map(c => ({ name: c.name, image: null }))
  );
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [newColorName, setNewColorName] = useState("");

  const [tagInput, setTagInput] = useState(tags.join(", "));
  const [sizeInput, setSizeInput] = useState(sizes.join(", "));
  const [detailInput, setDetailInput] = useState(moreDetails.join(", "));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTags(tagInput.split(",").map(t => t.trim()).filter(Boolean));
  }, [tagInput]);

  useEffect(() => {
    setSizes(sizeInput.split(",").map(s => s.trim()).filter(Boolean));
  }, [sizeInput]);

  useEffect(() => {
    setMoreDetails(detailInput.split(",").map(d => d.trim()).filter(Boolean));
  }, [detailInput]);

  const handleMainImageUpload = (file: File) => {
    setMainImage(file);
  };

  const handleColorImageUpload = (index: number, file: File) => {
    const updated = [...colors];
    updated[index].image = file;
    setColors(updated);
  };

  const addColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), image: null }]);
      setNewColorName("");
    }
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice(0);
    setCurrency("USD");
    setCategory("");
    setStatus("active");
    setStock(0);
    setTags([]);
    setSizes([]);
    setMoreDetails([]);
    setColors([]);
    setMainImage(null);
    setTagInput("");
    setSizeInput("");
    setDetailInput("");
    setNewColorName("");
  };

  const getFormData = () => {
    const formData = new FormData();
    const id =
      initialData?.id ||
      `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    formData.append("id", id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("currency", currency);
    formData.append("category", category);
    formData.append("status", status);
    formData.append("stock", stock.toString());

    if (mainImage) {
      formData.append("image", mainImage);
    }

    tags.forEach((tag, i) => {
      formData.append(`tags[${i}]`, tag);
    });

    sizes.forEach((size, i) => {
      formData.append(`options.sizes[${i}]`, size);
    });

    moreDetails.forEach((detail, i) => {
      formData.append(`moreDetails[${i}]`, detail);
    });

    colors.forEach((color, i) => {
      formData.append(`options.colors[${i}].name`, color.name);
      if (color.image) {
        formData.append(`options.colors[${i}].image`, color.image);
      }
    });

    return formData;
  };

  return {
    title,
    description,
    price,
    currency,
    category,
    status,
    stock,
    mainImage,
    tags,
    sizes,
    moreDetails,
    colors,
    isSubmitting,
    newColorName,
    tagInput,
    sizeInput,
    detailInput,

    setTitle,
    setDescription,
    setPrice,
    setCurrency,
    setCategory,
    setStatus,
    setStock,
    setMainImage,
    setTagInput,
    setSizeInput,
    setDetailInput,
    setNewColorName,
    setIsSubmitting,

    handleMainImageUpload,
    handleColorImageUpload,
    addColor,
    removeColor,
    getFormData,
    resetForm,
  };
}
