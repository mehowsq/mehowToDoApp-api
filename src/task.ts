export class Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;

  constructor(
    id: string,
    title: string,
    description: string,
    isCompleted: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.createdAt = createdAt;
  }
}
