import { Camera, LoaderPinwheel } from "lucide-react";
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
        <label className="btn-link scan-label-icon" title="Scan a nutrition label with your camera">
            {props.isScanning
                ? <LoaderPinwheel size={13} strokeWidth={2.5} className="spin" />
                : <Camera size={13} strokeWidth={2.5} />}
            {props.isScanning ? "Scanning…" : "Scan label"}
            <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} />
        </label>
    );
}
