import React, { useState } from "react";
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import {
  Message,
  Container,
  Grid,
  Input,
  Button,
} from "semantic-ui-react";
import "./Chat.css";
const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`;
const POST_MESSAGE = gql`
  mutation($content: String!, $user: String!) {
    postMessage(content: $content, user: $user)
  }
`;
const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES, /**
    {
    pollInterval: 500
    }
    */);
  return (
    <Container>
      {data &&
        data.messages.map(({ id, user: messageSender, content }) => (
          <Message
            key={id}
            className="message"
            color={messageSender !== user ? "blue" : "green"}
            style={{
              width: "35%",
              maxWidth: "50%",
              marginLeft: user === messageSender && "auto",
            }}>
            <Message.Header style={{ color: "black" }}>
              {messageSender}
            </Message.Header>
            <Message.Content style={{ color: "black" }}>
              {content}
            </Message.Content>
          </Message>
        ))}
    </Container>
  );
};
const Chat = () => {
  const [currentUser, setCurrentUser] = useState("Bob");
  const [message, setMessage] = useState("");
  const [postMessage] = useMutation(POST_MESSAGE);
  return (
    <Container style={{ margin: 14 }}>
      <Messages user={currentUser} />
      <Grid columns={3} width={16} style={{ marginTop: 5 }}>
        <Grid.Row>
          <Grid.Column width={3}>
            <Input
              style={{
                width: "100%",
              }}
              icon="user"
              placeholder="user name"
              value={currentUser}
              onChange={(event) => setCurrentUser(event.target.value)}
            />
          </Grid.Column>

          <Grid.Column width={8}>
            <Input
              style={{
                width: "100%",
                margin: "auto",
              }}
              placeholder="type message...."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Button
              icon="send"
              color="blue"
              content="Send"
              disabled={!message.length}
              onClick={() =>
                {
                setMessage("")  
                postMessage({
                  variables: { user: currentUser, content: message },
                })}
              }
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
export default Chat;
