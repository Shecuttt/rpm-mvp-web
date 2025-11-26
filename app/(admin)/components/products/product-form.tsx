/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { createProduct, updateProduct } from "@/lib/action/admin";
import { uploadProductImage } from "@/lib/utils/image-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/types";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { CurrencyInput } from "../currency-input";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be 0 or greater"),
  category_id: z.string().min(1, "Please select a category"),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;

  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url || null
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      category_id: product?.category_id || "",
      image_url: product?.image_url || "",
    },
  });

  const { handleSubmit, formState, register, setValue } = form;
  const { isSubmitting } = formState;

  // Auto-generate slug from name
  const watchName = useWatch({ control: form.control, name: "name" });
  const generateSlug = () => {
    const slug = watchName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    setValue("image_url", "");
  };

  async function onSubmit(values: FormValues) {
    try {
      // Validate image
      if (!imageFile && !imageUrl && !product?.image_url) {
        toast.error("Please upload a product image");
        return;
      }

      let finalImageUrl = imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResult = await uploadProductImage(formData);
        setUploadingImage(false);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload image");
          return;
        }

        finalImageUrl = uploadResult.url || "";
      } else if (product?.image_url) {
        // Keep existing image if editing and no new image
        finalImageUrl = product.image_url;
      }

      // Ensure we have an image URL
      if (!finalImageUrl) {
        toast.error("Product image is required");
        return;
      }

      // Update values with image URL
      const dataToSubmit = {
        ...values,
        image_url: finalImageUrl || null,
      };

      const result = isEdit
        ? await updateProduct(product.id, dataToSubmit)
        : await createProduct(dataToSubmit as any);

      if (result.success) {
        toast.success(`Product ${isEdit ? "updated" : "created"} successfully`);
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save product");
      }
    } catch (error) {
      toast.error("Something went wrong", { description: String(error) });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Image Upload */}
          <FieldGroup>
            <Field>
              <FieldLabel>Product Image</FieldLabel>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative size-64 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                )}

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading image...
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>

          {/* Product Name */}
          <FieldGroup>
            <Field>
              <FieldLabel>Product Name *</FieldLabel>
              <Input
                placeholder="Enter product name"
                {...register("name")}
                onBlur={generateSlug}
              />
              <FieldError>{formState.errors.name?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Slug */}
          <FieldGroup>
            <Field>
              <FieldLabel>Slug *</FieldLabel>
              <Input placeholder="product-slug" {...register("slug")} />
              <FieldError>{formState.errors.slug?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Description */}
          <FieldGroup>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Product description"
                rows={4}
                {...register("description")}
              />
              <FieldError>{formState.errors.description?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Price *</FieldLabel>
                <CurrencyInput
                  placeholder="0"
                  value={useWatch({ control: form.control, name: "price" })}
                  onValueChange={(value) => setValue("price", value)}
                />
                <FieldError>{formState.errors.price?.message}</FieldError>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Stock *</FieldLabel>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("stock", { valueAsNumber: true })}
                />
                <FieldError>{formState.errors.stock?.message}</FieldError>
              </Field>
            </FieldGroup>
          </div>

          {/* Category */}
          <FieldGroup>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select
                value={useWatch({ control: form.control, name: "category_id" })}
                onValueChange={(value) => setValue("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{formState.errors.category_id?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{isEdit ? "Update Product" : "Create Product"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting || uploadingImage}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
