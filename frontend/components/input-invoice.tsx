"use client";

import { useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AIResume from "@/components/ai-resume";

const InputInvoice = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadSuccess, setIsUploadSuccess] = useState(false);
    const [isAnalysisSuccess, setIsAnalysisSuccess] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setIsUploadSuccess(false);
            setIsAnalysisSuccess(false);
            setAnalysisResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return toast.error("Please, select a file.");

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        try {
            const uploadResponse = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setIsUploadSuccess(true);
            const invoiceData = uploadResponse.data.text;

            const analysisResponse = await api.post("/analysis", {
                invoice_data: invoiceData,
            });
            setIsAnalysisSuccess(true);
            setFile(null);
            setAnalysisResult(analysisResponse.data.analysis);
            toast.success("Data analysis complete!");
        } catch (error) {
            console.error("Error during the process:", error);
            toast.error("Something went wrong... Please, try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-full gap-8 p-4 lg:p-8">
            <div className="w-full lg:w-1/3 bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Invoice Upload</h1>
                <p className="mb-4 text-sm text-gray-600">
                    Please upload your invoice image for an AI analysis.
                </p>

                <Input className="w-full" type="file" onChange={handleFileChange} />
                <Button
                    onClick={handleUpload}
                    className="mt-4 w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        "Generate AI analysis"
                    )}
                </Button>

                {isUploadSuccess && (
                    <div className="mt-4 flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-6 w-6" />
                        <p>Data extracted successfully</p>
                    </div>
                )}

                {isAnalysisSuccess && (
                    <div className="mt-4 flex items-center text-green-600">
                        <CheckCircle className="mr-2 h-6 w-6" />
                        <p>AI analysis completed successfully</p>
                    </div>
                )}
            </div>

            {analysisResult && (
                <div className="w-full lg:w-2/3 bg-gray-50 shadow rounded-lg p-6 overflow-auto">
                    <AIResume ai_analysis={analysisResult} chat_id="1" />
                </div>
            )}
        </div>
    );
};

export default InputInvoice;
