"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createCategory, updateCategory } from "@/lib/action/admin";
import { Database } from "@/lib/types";
import { uploadCategoryImage } from "@/lib/utils/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Categories = Database["public"]["Tables"]["categories"]["Row"];

const formSchema = z.object({
  name: z.string().min(3, "Minimal 3 karakter"),
  slug: z.string().min(3, "Minimal 3 karakter"),
  description: z.string().min(10, "Minimal 10 karakter"),
  display_order: z.number().min(1, "Minimal 1"),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CategoriesForm({
  category,
}: {
  category?: Categories;
}) {
  const router = useRouter();
  const isEdit = !!category;

  const [imageUrl, setImageUrl] = useState(category?.image_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url || null
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      display_order: category?.display_order || 0,
      image_url: category?.image_url || "",
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
      if (!imageFile && !imageUrl && !category?.image_url) {
        toast.error("Please upload a category image");
        return;
      }

      let finalImageUrl = imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResult = await uploadCategoryImage(formData);
        setUploadingImage(false);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload image");
          return;
        }

        finalImageUrl = uploadResult.url || "";
      } else if (category?.image_url) {
        // Keep existing image if editing and no new image
        finalImageUrl = category.image_url;
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
        ? await updateCategory(category.id, dataToSubmit)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await createCategory(dataToSubmit as any);

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
              <FieldLabel>Gambar Kategori</FieldLabel>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative size-64 rounded-full overflow-hidden">
                    <Image
                      src={imagePreview || "https://placehold.co/200"}
                      alt="Category Preview"
                      fill
                      className="object-cover bg-gray-100"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="size-4" />
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

                {/* Image Upload */}
                {uploadingImage && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Spinner />
                    Uploading image...
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>

          {/* Category Name */}
          <FieldGroup>
            <Field>
              <FieldLabel>Nama Kategori *</FieldLabel>
              <Input
                placeholder="Masukkan Nama Kategori"
                {...register("name")}
                onBlur={generateSlug}
              />
              <FieldError>{formState.errors.name?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Category Slug */}
          <FieldGroup>
            <Field>
              <FieldLabel>Slug Kategori</FieldLabel>
              <Input
                placeholder="Masukkan Slug Kategori"
                {...register("slug")}
              />
              <FieldError>{formState.errors.slug?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Category Description */}
          <FieldGroup>
            <Field>
              <FieldLabel>Deskripsi Kategori</FieldLabel>
              <Input
                placeholder="Masukkan Deskripsi Kategori"
                {...register("description")}
              />
              <FieldError>{formState.errors.description?.message}</FieldError>
            </Field>
          </FieldGroup>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSubmitting || uploadingImage}>
              {isSubmitting ? <Spinner /> : isEdit ? "Update" : "Create"}
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
