const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('virtualFileSystem', 'zachj', '#Skillz101', {
    host: 'localhost',
    dialect: 'postgres', 
    schema: 'public',
});

const testConn = async (sequelize) => {
    //test database connection:
    try {
        await sequelize.authenticate();
        console.log("authetication to database successful");
    } catch(err) {
        console.error("Could not autheticate database connection: ", err);
    }
}

testConn(sequelize);

const vfs = sequelize.define('vfs', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    path: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    type: { 
        type: DataTypes.STRING, 
        allowNull: false }, // 'file' or 'directory'
  }, {
    timestamps: false
  });
  
  sequelize.sync();
  
  module.exports = { sequelize, vfs };

//a test query for if db stops working

// const testQuery = async () => {
//     try {
//         const file1 = vfs.create({
//             name: "file.txt",
//             path: "notes/file.txt",
//             type: "file"
//         });

//         console.log('inserted : ', file1.toJSON);
//     } catch (err) {
//         console.error("error occured with test query: ", err);
//     }
// }

// testQuery();