import { useState, DragEvent, KeyboardEvent } from "react";
import { Label } from "@/components/ui/label";

interface Props {
    from: "enroll" | "edit";
    profile?: { image?: string | null } | null;
    data: { image?: File | null };
    setData: (key: string, value: any) => void;
}

export default function ImageUpload({ from, profile, data, setData }: Props) {
    const [dragOver, setDragOver] = useState(false);
    const [hover, setHover] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setData("image", file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setData("image", file);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if ((e.key === "Backspace" || e.key === "Delete") && data.image) {
            setData("image", null);
        }
    };

    return (
        <div className="w-2/5 mx-auto">
            <Label htmlFor="image">လိုင်စင်ပုံ</Label>
            <div
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("image")?.click()}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`relative w-full h-40 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer overflow-hidden transition-all ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
            >
                {/* Image or Placeholder */}
                {data.image ? (
                    <img
                        src={URL.createObjectURL(data.image)}
                        className="w-full h-full object-contain"
                        alt="preview"
                    />
                ) : profile?.image ? (
                    <img
                        src={`/storage/${profile.image}`}
                        className="w-full h-full object-contain"
                        alt="profile"
                    />
                ) : (
                    <span className="text-sm text-gray-500 text-center px-2">
                        No Image
                    </span>
                )}

                {/* Hover overlay */}
                {(hover || dragOver) && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs text-center px-2">
                        Drag & Drop or Click anywhere to upload
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    id="image"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            {from == "edit" && <p className="text-[10px] text-gray-400 mt-1">
                Press Backspace/Delete to clear
            </p>}
        </div>
    );
}
