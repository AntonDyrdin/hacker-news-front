import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Header, Button, Loader, Container } from "semantic-ui-react";
import moment from "moment";
import { IComment, NewsDetailsStore } from "./../../stores/news-details.store";
import { INavigationData, withNavigation } from "../../hocs/with-route-params";
import CommentsList from "../../components/CommentsList";

type IProps = INavigationData;

interface IState {
  loading: boolean;
}

export const NewsPage = withNavigation(
  observer(
    class NewsPage extends React.Component<IProps, IState> {
      newsDetailsStore: NewsDetailsStore | null = null;

      state: IState = {
        loading: true,
      };

      componentDidMount() {
        const { id } = this.props.params as { id: string };
        this.newsDetailsStore = new NewsDetailsStore(Number(id));
        this.newsDetailsStore.fetchNewsDetails().finally(async () => {
          await this.newsDetailsStore?.fetchComments();

          this.setState({ loading: false });
        });
      }

      handleRefreshClick = () => {
        this.newsDetailsStore?.fetchComments();
      };

      handleCommentClick = (comment: IComment) => {
        this.newsDetailsStore?.fetchNestedComments(comment, this.newsDetailsStore.comments);
      };

      render() {
        const { loading } = this.state;

        if (loading || !this.newsDetailsStore) {
          return <Loader active>Loading...</Loader>;
        }

        const { newsDetails, comments } = this.newsDetailsStore;

        return (
          <Container text style={{ marginTop: "4em" }}>
            <Link to="/">Back to news list</Link>
            <Header as="h2">{newsDetails.title} </Header>
            <Header as="h3">
              <Link target="_blank" to={newsDetails.url}>
                {newsDetails.url}
              </Link>
            </Header>
            <div>
              <span>
                {moment.unix(newsDetails.time).format("DD.MM.YYYY HH:mm")}
              </span>
              <span> | </span>
              <span> by {newsDetails.by}</span>
              <span> | </span>
              <span> {newsDetails.descendants || 0} comments</span>
            </div>
            <Button
              onClick={this.handleRefreshClick}
              style={{ marginTop: "2em" }}
            >
              Refresh Comments
            </Button>
            {comments && (
              <CommentsList
                comments={comments}
                onCommentClick={this.handleCommentClick}
              />
            )}
          </Container>
        );
      }
    }
  )
);
