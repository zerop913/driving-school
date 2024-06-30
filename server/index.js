require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const pool = new Pool({
  host: process.env.REACT_APP_DB_HOST,
  port: process.env.REACT_APP_DB_PORT,
  database: process.env.REACT_APP_DB_NAME,
  user: process.env.REACT_APP_DB_USER,
  password: process.env.REACT_APP_DB_PASSWORD,
});

// // Создание таблицы пользователей и триггеров
// pool.query(`
//   CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     role VARCHAR(50) NOT NULL
//   );

//   CREATE OR REPLACE FUNCTION update_student_count()
//   RETURNS TRIGGER AS $$
//   BEGIN
//     UPDATE groups
//     SET student_count = (
//       SELECT COUNT(*) FROM student WHERE group_id = NEW.group_id
//     )
//     WHERE id = NEW.group_id;
//     RETURN NEW;
//   END;
//   $$ LANGUAGE plpgsql;

//   DROP TRIGGER IF EXISTS update_student_count_trigger ON student;

//   CREATE TRIGGER update_student_count_trigger
//   AFTER INSERT OR DELETE OR UPDATE ON student
//   FOR EACH ROW
//   EXECUTE PROCEDURE update_student_count();
// `);

// Роуты для аутентификации
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    console.log("Регистрация нового пользователя:", username);

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name = 'guest'"
    );

    if (roleResult.rows.length === 0) {
      console.error("Роль 'guest' не найдена в таблице roles");
      return res.status(400).json({ error: "Invalid role" });
    }

    const roleId = roleResult.rows[0].id;
    console.log("Идентификатор роли 'guest':", roleId);

    const result = await pool.query(
      "INSERT INTO users (username, password, role_id, full_name) VALUES ($1, $2, $3, $4) RETURNING id",
      [username, hashedPassword, roleId, fullName]
    );

    console.log(
      "Новый пользователь зарегистрирован с идентификатором:",
      result.rows[0].id
    );
    res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Ошибка при регистрации нового пользователя:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT u.*, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, role: user.role, fullName: user.full_name },
          process.env.REACT_APP_JWT_SECRET
        );
        res.json({ token, role: user.role, fullName: user.full_name });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Роуты для таблиц
const tables = [
  "driving_school",
  "staff",
  "course",
  "groups",
  "student",
  "inspector",
  "exam_route",
];

// Функция для поиска id по имени в указанной таблице
async function findIdByName(tableName, name) {
  const result = await pool.query(
    `SELECT id FROM ${tableName} WHERE name = $1`,
    [name]
  );
  if (result.rows.length === 0) {
    throw new Error(`${tableName} not found: ${name}`);
  }
  return result.rows[0].id;
}

// Объект с маппингом полей, которые требуют преобразования
const fieldMappings = {
  driving_school: {},
  staff: {
    driving_school_id: "driving_school",
  },
  course: {
    driving_school_id: "driving_school",
  },
  groups: {
    course_id: "course",
    inspector_id: "inspector",
  },
  student: {
    group_id: "groups",
  },
  inspector: {
    driving_school_id: "driving_school",
  },
  exam_route: {
    inspector_id: "inspector",
  },
};

tables.forEach((table) => {
  app.get(`/api/${table}`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table}`);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post(`/api/${table}`, async (req, res) => {
    try {
      let updatedBody = { ...req.body };

      // Преобразование полей, если необходимо
      for (const [field, relatedTable] of Object.entries(
        fieldMappings[table]
      )) {
        if (field in updatedBody && typeof updatedBody[field] === "string") {
          updatedBody[field] = await findIdByName(
            relatedTable,
            updatedBody[field]
          );
        }
      }

      const columns = Object.keys(updatedBody).join(", ");
      const values = Object.values(updatedBody);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
      const result = await pool.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`,
        values
      );
      res.json({ id: result.rows[0].id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put(`/api/${table}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Updating ${table}:`, req.body);

      // Проверка на пустое тело запроса
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No update data provided" });
      }

      let updatedBody = { ...req.body };

      // Преобразование полей, если необходимо
      for (const [field, relatedTable] of Object.entries(
        fieldMappings[table]
      )) {
        if (field in updatedBody && typeof updatedBody[field] === "string") {
          updatedBody[field] = await findIdByName(
            relatedTable,
            updatedBody[field]
          );
        }
      }

      const updates = Object.entries(updatedBody)
        .map(([key, value], i) => `${key} = $${i + 1}`)
        .join(", ");

      const values = Object.values(updatedBody);
      values.push(id);

      await pool.query(
        `UPDATE ${table} SET ${updates} WHERE id = $${values.length}`,
        values
      );
      res.sendStatus(200);
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete(`/api/${table}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.post("/api/student", upload.single("image"), async (req, res) => {
  try {
    const { full_name, passport_data, group_id } = req.body;
    const image = req.file ? req.file.filename : null;
    const result = await pool.query(
      "INSERT INTO student (full_name, passport_data, group_id, photo) VALUES ($1, $2, $3, $4) RETURNING id",
      [full_name, passport_data, group_id, image]
    );
    res.json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/student/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, passport_data, group_id } = req.body;
    const image = req.file ? req.file.filename : null;
    await pool.query(
      "UPDATE student SET full_name = $1, passport_data = $2, group_id = $3, photo = COALESCE($4, photo) WHERE id = $5",
      [full_name, passport_data, group_id, image, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT u.id, u.username, u.full_name, r.name AS role FROM users u JOIN roles r ON u.role_id = r.id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, ...userData } = req.body;

    console.log("Received role:", role);

    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name = $1",
      [role]
    );

    if (roleResult.rows.length === 0) {
      console.log("Invalid role:", role);
      return res.status(400).json({ error: "Invalid role" });
    }

    const roleId = roleResult.rows[0].id;

    const tableName = getTableNameByRole(role);
    if (!tableName) {
      console.log("Invalid role:", role);
      return res.status(400).json({ error: "Invalid role" });
    }

    console.log("Updating table:", tableName);
    console.log("Update data:", userData);

    // Обновляем роль в таблице users и получаем текущее full_name
    const userResult = await pool.query(
      "UPDATE users SET role_id = $1 WHERE id = $2 RETURNING full_name",
      [roleId, id]
    );

    const fullName = userResult.rows[0].full_name;

    // Проверяем, существует ли запись в соответствующей таблице
    const existingRecord = await pool.query(
      `SELECT * FROM ${tableName} WHERE user_id = $1`,
      [id]
    );

    if (existingRecord.rows.length > 0) {
      // Запись существует, обновляем ее
      const updateFields = Object.keys(userData)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(", ");
      const updateValues = Object.values(userData);
      updateValues.push(id);

      await pool.query(
        `UPDATE ${tableName} SET ${updateFields} WHERE user_id = $${updateValues.length}`,
        updateValues
      );
    } else {
      // Записи нет, создаем новую
      const columns = Object.keys(userData)
        .concat("user_id", "full_name")
        .join(", ");
      const values = Object.values(userData).concat(id, fullName);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

      await pool.query(
        `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
        values
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

const getTableNameByRole = (role) => {
  switch (role) {
    case "teacher":
      return "staff";
    case "inspector":
      return "inspector";
    case "student":
      return "student";
    default:
      return null;
  }
};

app.get("/api/driving_schools", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name FROM driving_school");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/groups", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, group_number FROM groups");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
