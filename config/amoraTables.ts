const schema = process.env.DB_SCHEMA;

const amoraTables = {
  USERS: `${schema}.users`,
  MESSAGES: `${schema}.messages`,
  CONVERSATIONS: `${schema}.conversations`,
  FRIENDS: `${schema}.friends`,
};

export default amoraTables;
