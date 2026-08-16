export interface Resume {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    isPrimary: boolean;
    uploadedAt: string;
    updatedAt: string;
}

export interface UploadResumeRequest {
    file: File;
    isPrimary?: boolean;
}
