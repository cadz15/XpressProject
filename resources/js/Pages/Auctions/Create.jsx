import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { AlertCircle, Upload, X } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

export default function Create() {
    const { categories } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        starting_price: "",
        duration_hours: 24,
        category_id: "",
        images: [],
    });

    const [preview, setPreview] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData("images", files);

        // Create preview URLs
        setPreview(files.map((file) => URL.createObjectURL(file)));
    };

    const removeImage = (index) => {
        const newFiles = [...data.images];
        newFiles.splice(index, 1);
        setData("images", newFiles);

        const newPreview = [...preview];
        URL.revokeObjectURL(newPreview[index]); // Clean up memory
        newPreview.splice(index, 1);
        setPreview(newPreview);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auctions.store"), {
            forceFormData: true, // ensures file uploads work
            onSuccess: (response) => {},
            onError: (error) => {
                if (error[0] === "You need at least 1 tokens.") {
                    alert("You need at least 1 tokens.");
                }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-center">
                <div className="container max-w-2xl py-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Create New Auction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className={
                                            errors.title
                                                ? "border-destructive"
                                                : ""
                                        }
                                        placeholder="Enter auction title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.description
                                                ? "border-destructive"
                                                : ""
                                        }
                                        placeholder="Describe your item in detail"
                                        rows="4"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Starting Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="starting_price">
                                        Starting Price ($)
                                    </Label>
                                    <Input
                                        id="starting_price"
                                        type="number"
                                        value={data.starting_price}
                                        onChange={(e) =>
                                            setData(
                                                "starting_price",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.starting_price
                                                ? "border-destructive"
                                                : ""
                                        }
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                    {errors.starting_price && (
                                        <p className="text-sm text-destructive">
                                            {errors.starting_price}
                                        </p>
                                    )}
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <Label htmlFor="duration_hours">
                                        Duration (hours)
                                    </Label>
                                    <Input
                                        id="duration_hours"
                                        type="number"
                                        value={data.duration_hours}
                                        onChange={(e) =>
                                            setData(
                                                "duration_hours",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.duration_hours
                                                ? "border-destructive"
                                                : ""
                                        }
                                        min="1"
                                        max="168"
                                    />
                                    {errors.duration_hours && (
                                        <p className="text-sm text-destructive">
                                            {errors.duration_hours}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData("category_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="category"
                                            className={
                                                errors.category_id
                                                    ? "border-destructive"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id.toString()}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Images */}
                                <div className="space-y-2">
                                    <Label htmlFor="images">
                                        Upload Images
                                    </Label>
                                    <div className="flex items-center justify-center w-full">
                                        <Label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/20"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">
                                                        Click to upload
                                                    </span>{" "}
                                                    or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG (MAX. 10MB each)
                                                </p>
                                            </div>
                                            <Input
                                                id="dropzone-file"
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </Label>
                                    </div>
                                    {errors.images && (
                                        <Alert
                                            variant="destructive"
                                            className="py-2"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                {errors.images}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Preview */}
                                {preview.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Image Previews</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {preview.map((src, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={src}
                                                        alt="Preview"
                                                        className="rounded-md shadow h-32 w-full object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() =>
                                                            removeImage(idx)
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-32"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Auction"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
