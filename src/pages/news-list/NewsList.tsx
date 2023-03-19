import React from "react";
import { Link, Route } from "react-router-dom";
import { observer } from "mobx-react";
import moment from "moment";
import { newsListStore } from "../../stores/news-list.store";
import { Container, Header, Button, List } from "semantic-ui-react";

interface News {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
}

export const NewsList = observer(
  class NewsList extends React.Component {
    componentDidMount() {
      newsListStore.startPolling();
    }

    componentWillUnmount() {
      newsListStore.stopPolling();
    }

    renderNewsList = () => {
      return newsListStore.newsList.map((news) => {
        const date = moment.unix(news.time).format("DD.MM.YYYY HH:mm");
        return (
          <List.Item key={news.id}>
            <Link to={`/news/${news.id}`}>
              <List.Content>
                <List.Header>{news.title}</List.Header>
                <List.Description>
                  <span>{news.score} points</span>
                  <span> | </span>
                  <span> by {news.by}</span>
                  <span> | </span>
                  <span> {date}</span>
                </List.Description>
              </List.Content>
            </Link>
          </List.Item>
        );
      });
    };

    render() {
      return (
        <Container text style={{ marginTop: "4em" }}>
          <Header as="h2" textAlign="center">
            Hacker News
          </Header>
          <Button fluid primary onClick={newsListStore.fetchNewsList}>
            Refresh
          </Button>
          <List divided relaxed="very" style={{ marginTop: "2em" }}>
            {this.renderNewsList()}
          </List>
        </Container>
      );
    }
  }
);
