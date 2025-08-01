export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  answerId: string;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  mentions: {
    id: string;
    username: string;
    image: string | null;
  }[];
}
