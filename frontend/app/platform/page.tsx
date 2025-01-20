import AIResume from "@/components/ai-resume";
import InputInvoice from "@/components/input-invoice";
import Navbar from "@/components/navbar";
import UploadsHistory from "@/components/uploads-history";

const PlatformPage = () => {
  return (
    <div className="min-h-screen">
            <Navbar />
            <div className="p-6">
                <div className="flex flex-col lg:flex-row w-full gap-32">
                    <div className="w-full lg:w-1/3">
                        <InputInvoice />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <AIResume ai_analysis="Example" chat_id="1"/>
                    </div>
                </div>
                <UploadsHistory history={[]} />
            </div>
        </div>
  );
};

export default PlatformPage;
