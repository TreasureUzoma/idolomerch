"use client";

import { useState, useEffect } from "react";

export interface ColorOption {
  name: string;
  image: string;
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
    colors?: ColorOption[];
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
  const [colors, setColors] = useState<ColorOption[]>(initialData.options?.colors || []);
  const [mainImage, setMainImage] = useState(initialData.image || "");
  const [newColorName, setNewColorName] = useState("");

  const [tagInput, setTagInput] = useState(tags.join(", "));
  const [sizeInput, setSizeInput] = useState(sizes.join(", "));
  const [detailInput, setDetailInput] = useState(moreDetails.join(", "));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync comma-separated inputs
  useEffect(() => {
    setTags(tagInput.split(",").map((t) => t.trim()).filter(Boolean));
  }, [tagInput]);

  useEffect(() => {
    setSizes(sizeInput.split(",").map((s) => s.trim()).filter(Boolean));
  }, [sizeInput]);

  useEffect(() => {
    setMoreDetails(detailInput.split(",").map((d) => d.trim()).filter(Boolean));
  }, [detailInput]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageUpload = async (file: File) => {
    const base64 = await convertToBase64(file);
    setMainImage(base64);
  };

  const handleColorImageUpload = async (index: number, file: File) => {
    const base64 = await convertToBase64(file);
    const updated = [...colors];
    updated[index].image = base64;
    setColors(updated);
  };

  const addColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), image: "" }]);
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
    setMainImage("");
    setTagInput("");
    setSizeInput("");
    setDetailInput("");
    setNewColorName("");
  };

  const getFormData = (): ProductFormInput => {
    return {
      id:
        initialData?.id ||
        `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title,
      description,
      price,
      currency,
      category,
      status,
      stock,
      image: "",
      imageBase64: mainImage,
      tags,
      moreDetails,
      options: {
        sizes,
        colors,
      },
    };
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
