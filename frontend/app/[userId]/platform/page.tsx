import InputInvoice from "@/components/input-invoice";
import Navbar from "@/components/navbar";
import UploadsHistory from "@/components/uploads-history";
import { FC } from "react";
import api from "@/services/api";

const PlatformPage: FC<{ params: { userId: string } }> = async ({ params }) => {
  const { userId } = params;

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

export default PlatformPage;
