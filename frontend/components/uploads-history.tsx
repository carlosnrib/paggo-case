import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UploadHistoryItem {
    id: string;
    name: string;
    url: string;
    ai_analysis: string;
}

interface UploadsHistoryProps {
    history: UploadHistoryItem[];
}

const UploadsHistory: React.FC<UploadsHistoryProps> = ({ history }) => {
    return (
        <div>
            <h2 className="text-xl font-semibold my-4">History</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>AI analysis</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    <img src={item.url} alt={item.name} className="h-16 w-16 object-cover" />
                                </a>
                            </TableCell>
                            <TableCell>{item.ai_analysis}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default UploadsHistory;