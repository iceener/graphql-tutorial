const { GraphQLServer } = require('graphql-yoga');

const moviesList = [
  { id: 1, title: 'Peaceful Warrior', duration: 0 },
  { id: 2, title: 'Gone in Sixty Seconds', duration: 60 },
  { id: 3, title: 'Matrix', duration: 404 }
];

const songsList = [
  { id: 1, title: 'Heart of courage'},
  { id: 2, title: 'For the Win'},
  { id: 3, title: 'Immortal'}
]

const resolvers = {
  // Media: {
    // __resolveType(obj, context, info) {
      // return 'Movie';
    // }
  // },
  Query: {
    demo: () => 'Hello GraphQL Schema!',
    // movies: () => moviesList,
    // movie: (parent, args) => moviesList.find(movie => movie.id == args.id),
    // song: (parent, args) => songsList.find(song => song.id == args.id)
  },
  // Mutation: {
    // createMovie: (parent, args) => {
      // const id = moviesList.length + 1
      // const movie = { id: id, title: args.movie.title, director: args.movie.director }
      // moviesList.push(movie);
      // return movie;
    // }
  // }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log(`Server is running on http://localhost:4000`));