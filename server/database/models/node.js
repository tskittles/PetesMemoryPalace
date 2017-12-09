'use strict';
module.exports = (sequelize, DataTypes) => {
  var Node = sequelize.define('Node', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    locX: DataTypes.STRING,
    locY: DataTypes.STRING,
    dateDescription: DataTypes.STRING,
    monthWord: DataTypes.STRING,
    dayWord: DataTypes.STRING,
    baseYearWord: DataTypes.STRING,
    endYearWord: DataTypes.STRING,
    monthImg: DataTypes.STRING,
    dayImg: DataTypes.STRING,
    baseYearImg: DataTypes.STRING,
    endYearImg: DataTypes.STRING,
    monthImgArray: {type: DataTypes.ARRAY(DataTypes.STRING)},
    dayImgArray: {type: DataTypes.ARRAY(DataTypes.STRING)},
    baseYearImgArray: {type: DataTypes.ARRAY(DataTypes.STRING)},
    endYearImgArray: {type: DataTypes.ARRAY(DataTypes.STRING)},
  });
  
  Node.associate = function(models) {
        Node.belongsTo(models.Palace, {
          onDelete: 'CASCADE'
        });
  }
  
  return Node;
};