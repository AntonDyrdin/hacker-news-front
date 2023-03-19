import { makeAutoObservable } from "mobx";
import axios from "axios";

export interface IComment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids?: number[];
  comments?: IComment[];
}

export class NewsDetailsStore {
  newsId: number;
  newsDetails: any;
  comments: IComment[] = [];

  constructor(newsId: number) {
    this.newsId = newsId;
    makeAutoObservable(this);
  }

  async fetchNewsDetails() {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/item/${this.newsId}.json`
    );
    this.newsDetails = response.data;
  }

  async fetchComments() {
    if (!this.newsDetails.kids) {
      this.comments = [];
      return;
    }

    const comments = await Promise.all(
      this.newsDetails.kids.map(async (commentId: number) => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/item/${commentId}.json`
        );
        return { ...response.data, comments: [] };
      })
    );

    this.comments = comments.filter(
      (comment: IComment) => comment?.text
    );
  }

  async fetchNestedComments(comment: IComment, comments: IComment[]) {
    if (!comment.kids) {
      return;
    }

    const nestedComments = await Promise.all(
      comment.kids.map(async (commentId: number) => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/item/${commentId}.json`
        );
        return { ...response.data, comments: [] };
      })
    );
    comment.comments = nestedComments;
    // TODO: возможно, не самый лучший способ триггерить рендер
    this.comments = [...comments];
  }
}
