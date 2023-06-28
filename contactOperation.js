import axios from "axios";
import dotenv from "dotenv";
import mysql from "mysql";
dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "mydb",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
    const table =
      "CREATE TABLE IF NOT EXISTS contacts (id MEDIUMINT NOT NULL AUTO_INCREMENT, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255), mobile_number VARCHAR(12), PRIMARY KEY (id))";
    connection.query(table, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Created");
      }
    });
  }
});

export const createContact = async (req, res) => {
  try {
    let data = req.body;
    let result;
    if (data.data_store === "CRM") {
      delete data.data_store;
      await axios
        .post(
          `https://${process.env.DOMAIN}.myfreshworks.com/crm/sales/api/contacts`,
          data,
          {
            method: "POST",
            headers: {
              Authorization: `Token token=${process.env.API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          result = response.data;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      const operation = `insert into contacts (first_name, last_name, email, mobile_number) values ('${data.first_name}', '${data.last_name}', '${data.email}', '${data.mobile_number}')`;
      const getResult = new Promise((resolve, reject) => {
        connection.query(operation, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.insertId);
          }
        });
      });
      await getResult
        .then((value) => (result = value))
        .catch((error) => {
          throw error;
        });
    }
    return res
      .status(200)
      .send({ status: true, message: "Added", data: result });
  } catch (err) {
    return res.status(500).send({ status: false, error: err });
  }
};

export const getContact = async (req, res) => {
  try {
    const data = req.body;
    if (!data.contact_id) {
      throw "No contact id provided";
    }
    let result;
    if (data.data_store === "CRM") {
      await axios
        .get(
          `https://${process.env.DOMAIN}.myfreshworks.com/crm/sales/api/contacts/${data.contact_id}`,
          {
            headers: {
              Authorization: `Token token=${process.env.API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          result = response.data;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      const operation = `select * from contacts where id = '${data.contact_id}'`;
      const getResult = new Promise((resolve, reject) => {
        connection.query(operation, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
      await getResult
        .then((value) => (result = value))
        .catch((error) => {
          throw error;
        });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: result });
  } catch (err) {
    return res.status(500).send({ status: false, error: err });
  }
};

export const updateContact = async (req, res) => {
  try {
    const data = req.body;
    if (!data.contact_id) {
      throw "No contact id provided";
    }
    let result;
    if (data.data_store === "CRM") {
      await axios
        .put(
          `https://${process.env.DOMAIN}.myfreshworks.com/crm/sales/api/contacts/${data.contact_id}`,
          data,
          {
            headers: {
              Authorization: `Token token=${process.env.API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          result = response.data;
        })
        .catch((error) => {
          throw error;
        });
    } else {
      const operation = `update contacts set email = '${data.new_email}', mobile_number = '${data.new_mobile_number}' where id = '${data.contact_id}'`;
      const getResult = new Promise((resolve, reject) => {
        connection.query(operation, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
      await getResult
        .then((value) => (result = value))
        .catch((error) => {
          throw error;
        });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: result });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const data = req.body;
    if (!data.contact_id) {
      throw "No contact id provided";
    }
    if (data.data_store === "CRM") {
      await axios
        .delete(
          `https://${process.env.DOMAIN}.myfreshworks.com/crm/sales/api/contacts/${data.contact_id}`,
          {
            headers: {
              Authorization: `Token token=${process.env.API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then(response)
        .catch((error) => {
          throw error;
        });
    } else {
      const operation = `delete from contacts where id = '${data.contact_id}'`;
      const getResult = new Promise((resolve, reject) => {
        connection.query(operation, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve("Sucess");
          }
        });
      });
      await getResult
        .then((value) => "Success")
        .catch((error) => {
          throw error;
        });
    }

    return res
      .status(200)
      .send({ status: true, message: "contact deleted successfully" });
  } catch (err) {
    return res.status(500).send({ status: false, Error: err });
  }
};

export default { createContact, getContact, updateContact, deleteContact };
