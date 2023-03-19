import React from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";
import { IComment } from "../stores/news-details.store";

interface IProps {
  comments: IComment[];
  onCommentClick: (comment: IComment) => void;
}

const CommentsList: React.FC<IProps> = ({ comments, onCommentClick }) => {
  const renderComments = (comments: IComment[]) => {
    if (!comments || comments.length === 0) {
      return null;
    }

    return (
      <Comment.Group>
        {comments.map((comment: any) => (
          <Comment key={comment.id}>
            <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
            <Comment.Content>
              <Comment.Author>{comment.by}</Comment.Author>
              <Comment.Metadata>
                <div>
                  {moment.unix(comment.time).format("DD.MM.YYYY HH:mm")}
                </div>
              </Comment.Metadata>
              <Comment.Text
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
              {!!comment.kids?.length && (
                <Comment.Actions>
                  <Comment.Action onClick={() => onCommentClick(comment)}>
                    Show {comment.kids?.length} replies
                  </Comment.Action>
                </Comment.Actions>
              )}
              {comment.comments && renderComments(comment.comments)}
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    );
  };

  return <>{renderComments(comments)}</>;
};

export default CommentsList;
