"use client";

import { useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const InputInvoice = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return toast.error("Please, select a file.");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(response.data);
            setFile(null);
            toast.success("Upload succesful!");
        } catch (error) {
            console.error("Error during upload:", error);
            toast.error("Something went wrong... Please, try with another file.");
        }
    };

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Invoice Upload</h1>
            <p className="mb-4">Please upload your invoice image for an AI analysis.</p>
            
            <Input className="w-full" type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} className="mt-2">Generate AI analysis</Button>
        </div>
    );
};

export default InputInvoice;