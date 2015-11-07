module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Friend", {
    friend_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    timestamps: false, // no created or update dates
    underscored: true //automatically attributes should be named with _
  });
};