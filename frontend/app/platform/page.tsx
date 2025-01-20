import InputInvoice from "@/components/input-invoice";
import Navbar from "@/components/navbar";
import UploadsHistory from "@/components/uploads-history";

const PlatformPage = () => {
  return (
    <div className="min-h-screen">
            <Navbar />
            <InputInvoice />
            <UploadsHistory history={[]} />
        </div>
  );
};

export default PlatformPage;
