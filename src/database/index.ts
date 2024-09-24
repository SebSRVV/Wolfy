import mongoose, { connect } from "mongoose";

const url = process.env.DB_URL || "";

mongoose.set("strictQuery", true);
connect(url)
	.then(() => console.info("MongoDB Conectado Exitosamente"))
	.catch((error: any) => {
		console.error(error);
		throw new Error("MongoDB Error de Conexion");
	});
