const mapAlbumsDB = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year,
});

const mapSongDB = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = {
  mapAlbumsDB,
  mapSongDB
};
