import { makeAutoObservable } from "mobx";
import axios from "axios";

interface News {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
}

const PER_PAGE = 10;
const NEWS_ON_MAIN_PAGE_COUNT = 100;

export class NewsListStore {
  newsList: News[] = [];
  pollingInterval: NodeJS.Timer | null = null;
  darkMode: boolean = true;

  constructor() {
    makeAutoObservable(this)
  }

  startPolling = () => {
    this.fetchNewsList();
    this.pollingInterval = setInterval(this.fetchNewsList, 60000);
  };

  stopPolling = () => {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  };

  fetchNewsList = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/newstories.json`)
      .then(async (response) => {
        const newsIds = response.data.slice(0, NEWS_ON_MAIN_PAGE_COUNT);
        const newsList: News[] = [];

        let page = 0;
        while (page * PER_PAGE < newsIds.length) {
          const pageNewsIds = response.data.slice(
            page * PER_PAGE,
            (page + 1) * PER_PAGE
          );
          await new Promise<void>((resolve) => {
            Promise.all(
              pageNewsIds.map((id: number) => {
                return axios
                  .get(`${process.env.REACT_APP_API_URL}/item/${id}.json`)
                  .then((response) => {
                    const news: News = {
                      id: response.data.id,
                      title: response.data.title,
                      score: response.data.score,
                      by: response.data.by,
                      time: response.data.time,
                    };

                    newsList.push(news);
                  })
                  .catch((error) => console.log(error));
              })
            ).then(() => {
              resolve();
            });
          });
          page++;
          this.newsList = [...newsList.sort((a, b) => b.time - a.time)];
        }
      })
      .catch((error) => console.log(error));
  };

  toggleDarkMode = () => {
    this.darkMode = !this.darkMode;
  };
}

export const newsListStore = new NewsListStore();
