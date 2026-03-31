// ১. মেসেজ পাঠানোর সময় ক্লায়েন্ট থেকে যা আসবে (Payload)
export interface MessagePayload {
  roomId: string;      // মূলত এটিই আপনার conversationId
  senderId: string;
  senderName: string;
  content: string;     // Schema অনুযায়ী 'text' এর বদলে 'content'
  timestamp: Date | string;
}

// ২. ডাটাবেসে সেভ হওয়ার পর সার্ভার থেকে যা পাঠানো হবে (Response)
// এটি আপনার Prisma Message Model-এর সাথে হুবহু মিলবে
export interface MessageResponse {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: Date | string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
}

// ৩. Client to server (socket.on)
export interface ClientToServerEvents {
  join_room: (roomId: string) => void;
  send_message: (data: MessagePayload) => void;
  start_typing: (data: { 
    roomId: string; 
    userId: string; 
    userName: string 
  }) => void;
  stop_typing: (data: { 
    roomId: string; 
    userId: string 
  }) => void;
  join_notification_room: (userId: string) => void;
}

// ৪. Server to client (socket.emit / io.to.emit)
export interface ServerToClientEvents {
  // এখন থেকে মেসেজ রিসিভ করার সময় আমরা ফুল সেভ হওয়া অবজেক্ট পাঠাবো
  receive_message: (data: MessageResponse) => void; 
  user_typing: (data: { 
    userId: string; 
    userName: string 
  }) => void;
  user_stop_typing: (data: { 
    userId: string 
  }) => void;
  new_notification: (data: any) => void;
}