import React, { useState, useRef } from 'react';
import { useClubData } from '../../hooks/useClubData';

interface ImageUploadFieldProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    folder: 'events' | 'profiles' | 'logos';
    className?: string;
    placeholder?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
    label, value, onChange, folder, className = "", placeholder 
}) => {
    const { uploadImage, dbStatus } = useClubData();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: 1MB Limit
        if (file.size > 1024 * 1024) {
            setError('File size exceeds 1 MB limit.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Validation: Types
        // PNG is only allowed for logos and profiles per requirements
        const isPngAllowed = folder === 'logos' || folder === 'profiles';
        const allowedTypes = isPngAllowed 
            ? ['image/jpeg', 'image/jpg', 'image/png'] 
            : ['image/jpeg', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
            setError(isPngAllowed 
                ? 'Invalid format. Use JPG or PNG.' 
                : 'Invalid format. Use JPG/JPEG for events.');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const url = await uploadImage(file, folder);
            if (url) {
                onChange(url);
            }
        } catch (err) {
            setError('Upload failed. Check connection.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
                {label}
            </label>
            
            <div className="relative group">
                <div className={`relative w-full h-40 bg-gray-900/50 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                    error ? 'border-rose-500/50' : 'border-gray-700 hover:border-teal-500/50'
                }`}>
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center text-center px-4">
                                <svg className="w-8 h-8 text-teal-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0l-4-4m4 4v12" />
                                </svg>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Change Image</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center px-4">
                            <div className={`w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-3 border border-gray-700 ${uploading ? 'animate-pulse' : ''}`}>
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {uploading ? 'Processing...' : 'Click to upload image file'}
                            </p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">MAX 1MB • {folder === 'events' ? 'JPG' : 'JPG/PNG'}</p>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept={folder === 'events' ? ".jpg,.jpeg" : ".jpg,.jpeg,.png"}
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        disabled={uploading || dbStatus !== 'connected'}
                    />
                </div>
                
                {dbStatus !== 'connected' && (
                    <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-30">
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Offline: Upload Disabled</p>
                    </div>
                )}
            </div>

            {error && <p className="text-[9px] text-rose-500 font-bold uppercase mt-2 ml-1 animate-bounce">{error}</p>}
        </div>
    );
};

export default ImageUploadField;