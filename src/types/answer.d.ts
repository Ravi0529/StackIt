export interface Answer {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "approved" | "pending";
  user: {
    id: string;
    username: string;
    image?: string | null;
  };
  commentCount: number;
  upvotes: number;
  downvotes: number;
  userVote?: "UP" | "DOWN" | null;
  question?: {
    userId: string;
  };
}
