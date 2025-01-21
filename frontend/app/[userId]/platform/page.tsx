import InputInvoice from "@/components/input-invoice";
import Navbar from "@/components/navbar";
import UploadsHistory from "@/components/uploads-history";
import api from "@/services/api";

export default async function PlatformPage({params}: {params: Promise<{ userId: string }>}){
  const { userId }  = await params;

  const fetchHistory = async (chatId: string) => {
    try {
      const response = await api.get(`/invoices/${chatId}`);
      return response.data.invoices; 
    } catch (error) {
      console.error("Erro ao buscar histórico de uploads:", error);
      return []; 
    }
  };

  const history = await fetchHistory(userId);
  
  return (
    <div className="min-h-screen">
            <Navbar />
            <InputInvoice userId={userId}/>
            <UploadsHistory history={history}/>
        </div>
  );
};
