const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');
const { prisma } = require('./generated/prisma-client');

const resolvers = {
  Query: {
    movies: async () => await prisma.movies(),
    directors: async () => await prisma.directors(),
    movie: async (parent, args, context, info) => {
      return prisma.movie({ id: args.id });
    },
    director: async (parent, args, context, info) => {
      return prisma.director({ id: args.id });
    }
  },
  Mutation: {
    createMovie: async(parent, args) => {
      const movie = { title: args.title, duration: args.duration, director: {
        connect: { id: args.director }
      } };
      return prisma.createMovie(movie);
    },
    deleteMovie: async(parent, args) => {
      return prisma.deleteMovie({ id: args.id });
    },
    updateMovie: async(parent, { id, title, duration, director_id }) => {
      const movie = await prisma.movie({ id: id });
      const movieData = {
        title: title ? title : movie.title, 
        duration: duration ? duration : movie.duration
      }

      if (director_id) {
        movieData.director = {
          connect: {
            id: director_id
          }
        }
      }

      return prisma.updateMovie({
        data: movieData,
        where: { id: id }
      });
    },
    createDirector: async(parent, args) => {
      const director = { name: args.name };
      return prisma.createDirector(director);
    },
    deleteDirector: async(parent, args) => {
      return prisma.deleteDirector({ id: args.id });
    },
  },
  Movie: {
    duration: ({ duration }, args) => {
      if (args.unit == 'MINUTES') return Math.round(duration / 60);
      if (args.unit == 'HOURS') return Math.round(duration / 3600);

      return duration;
    },
    director: async (parent, args, context, info) => {
      return prisma.movie({ id: parent.id }).director()
    }
  },
  Director: {
    movies: (parent, args, context, info) => {
      return moviesList.filter(movie => movie.director_id == parent.id);
    }
  }
}

const server = new ApolloServer({
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});