export interface Question {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    username: string;
    image?: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
  _count: {
    answers: number;
  };
}
