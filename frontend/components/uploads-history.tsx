"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

interface UploadHistoryItem {
    id: string;
    imageUrl: string; 
    aiAnalysis: string;
    createdAt: string;
}

interface UploadsHistoryProps {
    history: UploadHistoryItem[];
}

const UploadsHistory: React.FC<UploadsHistoryProps> = ({ history }) => {
    const generatePdf = async (item: UploadHistoryItem) => {
        try {
            const pdf = new jsPDF({
                unit: "mm",  
                format: "a4",
            });
    
            const img = new Image();
            img.crossOrigin = "anonymous"; 
            img.src = item.imageUrl;
    
            img.onload = () => {
                const maxWidth = 190;  
                const imgWidth = Math.min(img.width * (maxWidth / img.width), maxWidth); 
    
                const imgHeight = img.height * (imgWidth / img.width);
    
                pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight); 
    
                pdf.addPage();
    
                pdf.setFont("times", "normal");
                pdf.setFontSize(11);  

                pdf.text("AI Analysis:", 10, 10);
    
                const analysisText = item.aiAnalysis;
                const marginLeft = 10;  
                const marginRight = 10; 
                const availableWidth = 190; 
                const textX = marginLeft;
                const textY = 20; 
    
                const lines = pdf.splitTextToSize(analysisText, availableWidth);
    
                pdf.text(lines, textX, textY);
    
                pdf.text("Created At:", 10, 280);
                pdf.text(new Date(item.createdAt).toLocaleString("pt-BR"), 10, 290);
    
                pdf.save(`invoice-${item.id}.pdf`);
            };
    
            img.onerror = () => {
                toast.error("Error generating PDF");
            };
        } catch (error) {
            toast.error("Error generating PDF");
            console.error("Error generating PDF:", error);
        }
    };
    

    return (
        <div className="m-6">
            <h2 className="text-xl font-semibold my-4">History</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>AI analysis</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history && history.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                                    Open Image
                                </a>
                            </TableCell>
                            <TableCell>{item.aiAnalysis}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                            <TableCell>
                                <Download
                                    onClick={() => generatePdf(item)}
                                    className="cursor-pointer"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UploadsHistory;
