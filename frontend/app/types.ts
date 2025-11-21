// Interfaces definidas en tu prompt para Type Safety

export interface Message {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export interface UploadedFile {
    filename: string;
    status: 'processing' | 'ready' | 'error';
}

export interface ChatSession {
    id: string;
    messages: Message[];
}