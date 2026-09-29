import { Camera, LoaderPinwheel  } from "lucide-react";
import React from "react";

type ScanLabelProps = {
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    isScanning: boolean;
}

export default function ScanLabel(props: ScanLabelProps) {

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            props.setFile(e.target.files[0])
        }
    }
    
    return (
        <>
        {!props.isScanning ? 
            <label className="scan-label-icon" title="Scan a nutrition label">
                <Camera size={16} strokeWidth={2.25} />
                <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
            </label>
        : 
            <label className="scan-label-icon" title="Scan a nutrition label">
                <LoaderPinwheel size={16} strokeWidth={2.25} className="spin" />
                <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
            </label>    

        }
        </>
    );
}
