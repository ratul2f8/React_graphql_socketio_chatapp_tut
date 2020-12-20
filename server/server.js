const { GraphQLServer, PubSub } = require("graphql-yoga");
const messages = [
  { id: 0, content: "Hello from John", user: "John" },
  { id: 1, content: "Hello from Bob", user: "Bob" },
  { id: 2, content: "Hello from Bethany", user: "Bethany" },
];
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);
const typeDefs = `
  type Message{
      id: ID!,
      content: String!,
      user: String!
  }
  type Query{
      messages: [Message!]!
  }
  type Mutation{
      postMessage(content: String!, user: String!): ID!
  }
  type Subscription{
      messages: [Message!]
  }
`;
const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({ id, content, user });
      subscribers.forEach(fn => fn());
      return id;
    },
  },
  Subscription:{
      messages: {
         subscribe: (parent, args, {pubsub}) => {
             const channel = Math.random().toString(36).slice(2, 15);
             onMessagesUpdates(() => pubsub.publish(channel, {messages}));
             setTimeout(() => pubsub.publish(channel, {messages}), 0);
             return pubsub.asyncIterator(channel);
         }
      }
  }
};
const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context : {pubsub} });
server.start(({ port }) => console.log(`Server Started at port : ${port}`));
