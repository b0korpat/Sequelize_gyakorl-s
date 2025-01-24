import Sequelize, { Op } from "sequelize";

const { DataTypes } = Sequelize;

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",  
    define: {
        timestamps: false,  
    },
});

const Student = sequelize.define("student", {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [4, 20], 
        },
    },
    favorite_class: {
        type: DataTypes.STRING(25),
        defaultValue: "Computer Science",  
    },
    school_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    has_language_examination: {
        type: DataTypes.TINYINT,
        defaultValue: true, 
    },
});

sequelize.sync({ alter: true })
    .then(() => {
        return Student.bulkCreate([
            { name: "Joe", favorite_class: "Angol", school_year: 2022, has_language_examination: true },
            { name: "Willi", favorite_class: "Matek", school_year: 2022, has_language_examination: false },
            { name: "Jack", favorite_class: "Magyar", school_year: 2021, has_language_examination: true },
            { name: "Averell", favorite_class: "Töri", school_year: 2021, has_language_examination: false },
            { name: "Lajos", favorite_class: "Info", school_year: 2011, has_language_examination: true },
        ]);
    })
    .then((data) => {
        data.forEach((element) => {
            console.log(element.toJSON());
        });
    })
    .catch((err) => {
        console.log(`Error: ${err.message}`);
    });


console.log('Student query:');
Student.findAll({
    attributes: ['name'],
    where: {
        [Op.or]: [
            { favorite_class: "Computer Science" },
            { has_language_examination: true }
        ]
    }
}).then((students) => {
    const uniqueStudents = new Set();
    students.forEach(student => {
        if (!uniqueStudents.has(student.name)) {
            console.log(student.name);
            uniqueStudents.add(student.name);  
        }
    });
}).catch((err) => {
    console.log(`Error: ${err.message}`);
});


Student.findAll({
        attributes: [
            "name",
            [sequelize.fn("COUNT", sequelize.col("name")), "students"],
        ],
        group: "school_year",
    }).then((results) => {
        results.forEach(result => {
            console.log(`School Year: ${result.school_year}, Students: ${result.get("students")}`);
        });
    })
    .catch((err) => {
        console.log("Error:", err.message);
    });
    
console.log(sequelize.models.student);
