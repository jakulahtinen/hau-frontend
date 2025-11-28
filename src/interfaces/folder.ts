export interface Folder {
    id: number;
    name: string; // Folder title
    createdAt: string;
    coverImageUrl?: string; // URL of the latest picture in the folder
}